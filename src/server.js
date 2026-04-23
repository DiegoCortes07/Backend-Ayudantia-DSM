import dotenv from "dotenv";
dotenv.config();
import express from "express";
import RouterApp from "./routes/api.js";
import cors from "cors";
import { initializeAssociations } from "./models/associations.js";

export default class Server {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  listen() {
    try {
      initializeAssociations();

      this.app.listen(process.env.PORT, () => {
        console.log("Hola!!");
        console.log(
          `Servidor corriendo en el puerto http://localhost:${process.env.PORT}`,
        );
      });
    } catch (error) {
      console.error("Error al iniciar el servidor", error);
      process.exit(1);
    }
  }

  routes() {
    this.app.use("/api", RouterApp);
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }
}
