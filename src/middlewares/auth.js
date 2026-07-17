import jwt from "jsonwebtoken";
import User from "../models/user.js";

export function getBearerToken(req) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.replace("Bearer ", "").trim();
}

export async function getUserFromToken(token) {
  if (!token) {
    return null;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return User.findByPk(decoded.userId);
}

export async function requireAuth(req, res, next) {
  try {
    const user = await getUserFromToken(getBearerToken(req));

    if (!user) {
      return res.status(401).json({ message: "Sesion no valida" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error al validar sesion", error);
    return res.status(401).json({ message: "Sesion no valida" });
  }
}
