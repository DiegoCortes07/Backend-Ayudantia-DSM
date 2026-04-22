import Server from "./server.js";
import { syncAndSeed } from "./database/seeders/syncAndSeed.js";
import { initializeAssociations } from "./models/associations.js";

const bootstrap = async () => {
  try {
    initializeAssociations();
    await syncAndSeed();

    const server = new Server();
    server.listen();
  } catch (error) {
    console.error("Error al iniciar la aplicacion", error);
    process.exit(1);
  }
};

bootstrap();
