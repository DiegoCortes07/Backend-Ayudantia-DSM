import Product from "../../models/product.js";

const products = [
  {
    id: 1,
    name: "Cuaderno universitario",
    description: "Cuaderno de 100 hojas cuadriculado",
    price: 2990,
    stock: 40,
    is_active: true,
  },
  {
    id: 2,
    name: "Lapiz pasta azul",
    description: "Lapiz pasta tinta azul",
    price: 590,
    stock: 120,
    is_active: true,
  },
  {
    id: 3,
    name: "Mochila escolar",
    description: "Mochila con multiples compartimentos",
    price: 24990,
    stock: 15,
    is_active: true,
  },
  {
    id: 4,
    name: "Producto descontinuado",
    description: "Producto de ejemplo inactivo",
    price: 1000,
    stock: 0,
    is_active: false,
  },
];

export async function seedProducts(transaction) {
  const count = await Product.count({ transaction });

  if (count > 0) {
    console.log("Seed omitido para Products: ya existen datos");
    return;
  }

  await Product.bulkCreate(products, { transaction });
  console.log("Seed ejecutado para Products");
}
