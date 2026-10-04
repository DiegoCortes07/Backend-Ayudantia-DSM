import sequelize from "../config/database.js";
import Local from "../models/local.js";
import Order, { ORDER_STATUSES } from "../models/order.js";
import Product from "../models/product.js";

function toCoordinate(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function isValidLatitude(value) {
  return value !== null && value >= -90 && value <= 90;
}

function isValidLongitude(value) {
  return value !== null && value >= -180 && value <= 180;
}

function getNextStatus(currentStatus) {
  const currentIndex = ORDER_STATUSES.indexOf(currentStatus);

  if (currentIndex === -1 || currentIndex === ORDER_STATUSES.length - 1) {
    return currentStatus;
  }

  return ORDER_STATUSES[currentIndex + 1];
}

function getOrderWithDetails(orderId, userId) {
  return Order.findOne({
    where: { id: orderId, userId },
    include: [
      { model: Product, as: "product" },
      { model: Local, as: "local" },
    ],
  });
}

export async function getMyOrders(req, res) {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Product, as: "product" },
        { model: Local, as: "local" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener pedidos", error);
    return res.status(500).json({ message: "Error al obtener pedidos" });
  }
}

export async function createOrder(req, res) {
  try {
    const {
      productId,
      localId,
      quantity = 1,
      deliveryLatitude,
      deliveryLongitude,
    } = req.body;

    const parsedProductId = Number(productId);
    const parsedLocalId = localId ? Number(localId) : null;
    const parsedQuantity = Number(quantity);
    const latitude = toCoordinate(deliveryLatitude);
    const longitude = toCoordinate(deliveryLongitude);

    if (!Number.isInteger(parsedProductId)) {
      return res.status(400).json({ message: "Producto invalido" });
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: "Cantidad invalida" });
    }

    if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
      return res.status(400).json({ message: "Ubicacion de entrega invalida" });
    }

    const createdOrder = await sequelize.transaction(async (transaction) => {
      const product = await Product.findByPk(parsedProductId, { transaction });

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      if (!product.is_active) {
        throw new Error("PRODUCT_INACTIVE");
      }

      const stock = Number(product.stock);

      if (stock < parsedQuantity) {
        throw new Error("PRODUCT_WITHOUT_STOCK");
      }

      const localWhere = parsedLocalId
        ? { id: parsedLocalId, is_active: true }
        : { is_active: true };

      const local = await Local.findOne({
        where: localWhere,
        order: [["id", "ASC"]],
        transaction,
      });

      if (!local) {
        throw new Error("LOCAL_NOT_FOUND");
      }

      await product.update(
        {
          stock: stock - parsedQuantity,
        },
        { transaction },
      );

      return Order.create(
        {
          userId: req.user.id,
          productId: product.id,
          localId: local.id,
          quantity: parsedQuantity,
          total_price: Number(product.price) * parsedQuantity,
          delivery_latitude: latitude,
          delivery_longitude: longitude,
          status: "recibido",
        },
        { transaction },
      );
    });

    const order = await getOrderWithDetails(createdOrder.id, req.user.id);

    return res.status(201).json({
      message: "Pedido creado correctamente",
      order,
      statusFlow: ORDER_STATUSES,
    });
  } catch (error) {
    if (error.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (error.message === "PRODUCT_INACTIVE") {
      return res.status(400).json({ message: "Producto no disponible" });
    }

    if (error.message === "PRODUCT_WITHOUT_STOCK") {
      return res.status(400).json({ message: "Producto sin stock suficiente" });
    }

    if (error.message === "LOCAL_NOT_FOUND") {
      return res.status(400).json({ message: "No hay locales disponibles" });
    }

    console.error("Error al crear pedido", error);
    return res.status(500).json({ message: "Error al crear pedido" });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const requestedStatus = req.body.status;
    const order = await Order.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const nextStatus = requestedStatus || getNextStatus(order.status);

    if (!ORDER_STATUSES.includes(nextStatus)) {
      return res.status(400).json({ message: "Estado de pedido invalido" });
    }

    await order.update({ status: nextStatus });

    const updatedOrder = await getOrderWithDetails(order.id, req.user.id);

    return res.status(200).json({
      message: "Estado actualizado correctamente",
      order: updatedOrder,
      statusFlow: ORDER_STATUSES,
    });
  } catch (error) {
    console.error("Error al actualizar pedido", error);
    return res.status(500).json({ message: "Error al actualizar pedido" });
  }
}
