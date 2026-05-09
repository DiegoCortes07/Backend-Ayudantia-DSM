import sequelize from "../config/database.js";
import { seedProducts } from "./seeders/products.js";
import { seedRoles } from "./seeders/roles.js";
import { seedUsers } from "./seeders/users.js";

export async function seedDatabase() {
  await sequelize.sync();

  const transaction = await sequelize.transaction();

  try {
    await seedRoles(transaction);
    await seedUsers(transaction);
    await seedProducts(transaction);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error("Error al ejecutar los seeds iniciales", error);
    throw error;
  }
}
