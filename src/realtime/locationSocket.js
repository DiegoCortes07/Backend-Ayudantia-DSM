import { Server as SocketServer } from "socket.io";
import Local from "../models/local.js";
import User from "../models/user.js";
import { getUserFromToken } from "../middlewares/auth.js";

// Todos los clientes de la demostracion se suscriben a esta sala.
const DELIVERY_DEMO_ROOM = "delivery:demo";

// La ultima posicion se guarda en memoria para que un nuevo suscriptor
// no tenga que esperar al siguiente movimiento del delivery.
let latestDeliveryLocation = null;

function sanitizeCoordinate(value, min, max) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < min || number > max) {
    return null;
  }

  return number;
}

function serializeStore(store) {
  return {
    id: store.id,
    name: store.name,
    address: store.address,
    latitude: Number(store.latitude),
    longitude: Number(store.longitude),
  };
}

function buildDeliveryPayload(user, location) {
  return {
    userId: user.id,
    name: user.name,
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: Number.isFinite(Number(location.accuracy))
      ? Number(location.accuracy)
      : null,
    timestamp: location.timestamp || new Date().toISOString(),
  };
}

async function getSocketUser(socket) {
  const token = socket.handshake.auth?.token;
  const fallbackUserId = socket.handshake.auth?.userId;

  if (token) {
    return getUserFromToken(token);
  }

  // Fallback util solo para la demostracion local sin token.
  if (fallbackUserId) {
    return User.findByPk(fallbackUserId);
  }

  return null;
}

export function initializeLocationSocket(httpServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const user = await getSocketUser(socket);

      if (!user) {
        return next(new Error("Usuario no autenticado"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Sesion de socket no valida"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;

    // SUBSCRIPCION: el cliente pide entrar al canal de la simulacion.
    socket.on("delivery:subscribe", async () => {
      try {
        const store = await Local.findOne({
          where: { is_active: true },
          order: [["id", "ASC"]],
        });

        if (!store) {
          return socket.emit("delivery:error", {
            message: "No existe una tienda activa para la simulacion",
          });
        }

        socket.join(DELIVERY_DEMO_ROOM);

        // Confirmacion de la suscripcion y estado inicial del mapa.
        socket.emit("delivery:subscribed", {
          message: "Suscripcion activa",
          store: serializeStore(store),
          deliveryLocation: latestDeliveryLocation,
        });
      } catch (error) {
        console.error("Error al suscribir delivery", error);
        socket.emit("delivery:error", {
          message: "No se pudo iniciar la simulacion",
        });
      }
    });

    // PUBLICACION: el frontend envia la posicion actual del delivery.
    socket.on("delivery:location:update", (location = {}) => {
      if (!socket.rooms.has(DELIVERY_DEMO_ROOM)) {
        return socket.emit("delivery:error", {
          message: "Primero debes suscribirte a la simulacion",
        });
      }

      const latitude = sanitizeCoordinate(location.latitude, -90, 90);
      const longitude = sanitizeCoordinate(location.longitude, -180, 180);

      if (latitude === null || longitude === null) {
        return socket.emit("delivery:error", {
          message: "Coordenadas invalidas",
        });
      }

      latestDeliveryLocation = buildDeliveryPayload(user, {
        ...location,
        latitude,
        longitude,
      });

      // NOTIFICACION: todos los suscriptores de la sala reciben el cambio,
      // incluido el cliente que publico la ubicacion.
      io.to(DELIVERY_DEMO_ROOM).emit(
        "delivery:location:updated",
        latestDeliveryLocation,
      );
    });

    // El cliente deja de recibir los eventos de esta sala.
    socket.on("delivery:unsubscribe", () => {
      socket.leave(DELIVERY_DEMO_ROOM);
    });
  });

  return io;
}
