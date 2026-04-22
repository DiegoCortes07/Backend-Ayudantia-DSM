import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.resolve(__dirname, "../database/database.sqlite");

const database = new Sequelize({
  dialect: "sqlite",
  storage: storagePath,
});

const auth = async () => {
  try {
    await database.authenticate();
    console.log("La conexion ha sido establecida correctamente");
  } catch (error) {
    console.error("Hubo un error para conectar con la base de datos", error);
  }
};

auth();

export default database;
