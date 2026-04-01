import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import "./config/database.js";

export default class Server {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);

    this.routes();
  }
  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log("Hola!!");
    });
  }

  routes() {
    this.app.use("/", (req, res) => {
      res.json({ contrasena: "Hola123" });
    });
  }
}
