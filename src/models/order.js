import sequelize from "../config/database.js";
import { DataTypes, Model } from "sequelize";

export const ORDER_STATUSES = [
  "recibido",
  "preparando",
  "en_camino",
  "entregado",
];

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...ORDER_STATUSES),
      allowNull: false,
      defaultValue: "recibido",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    delivery_latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
    },
    delivery_longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    localId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Locals",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "Orders",
    timestamps: true,
  },
);

export default Order;
