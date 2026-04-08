import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import "./config/database.js";
import RouterApp from "./routes/api.js";
import cors from "cors";

import { initializeAssociations } from "./models/associations.js";

initializeAssociations();

export default class Server {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.middlewares();
    this.routes();
  }
  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log("Hola!!");
      console.log(
        `Servidor corriendo en el puerto http://localhost:${process.env.PORT}`,
      );
    });
  }

  routes() {
    this.app.use("/api", RouterApp);
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }
}
