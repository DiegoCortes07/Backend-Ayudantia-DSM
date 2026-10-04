import Product from "../models/product.js";

// Funciones para el modelo PRODUCT

export async function getProducts(req, res) {
  try {
    const products = await Product.findAll();

    if (products.length === 0) {
      return res.status(400).json({ message: "No se encontraron productos" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener los productos", error);
    return res.status(500).json({ message: "Error al obtener los productos" });
  }
}

export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, is_active } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: "Campos insuficientes.." });
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      return res
        .status(400)
        .json({ message: "El precio y stock no pueden ser negativos" });
    }

    const newProduct = await Product.create({
      name,
      description: description || null,
      price,
      stock,
      is_active: is_active ?? true,
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear el producto", error);
    return res.status(500).json({ message: "Error al crear el producto" });
  }
}
