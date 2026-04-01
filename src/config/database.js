import { Sequelize } from "sequelize";

const database = new Sequelize({
  dialect: "sqlite",
  storage: "./src/database/database.sqlite",
});

const auth = async () => {
  try {
    await database.authenticate();
    console.log("La conexion ha sido establecida correctamente");
  } catch {
    console.error("Hubo un error para conectar con la base de datos", error);
  }
};

auth();

export default database;