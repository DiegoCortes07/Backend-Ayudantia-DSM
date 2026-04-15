import User from "../models/user.js";
import { Op } from "sequelize";

// Funciones para el modelo USER

export async function getUsers(req, res) {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      return res.status(400).json({ message: "No se encontraron usuarios" });
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios", error);
    return res.status(500).json({ message: "Error al obtener los usuarios" });
  }
}

export async function createUser(req, res) {
  try {
    const { email, password, name, username, phone } = req.body;

    if (!email || !password || !name || !username || !phone) {
      return res.status(400).json({ message: "Campos insuficientes.." });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }, { phone }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    const newUser = await User.create({
      email,
      password,
      name,
      username,
      phone,
      roleId: 1, // Asignar el rol de "Usuario" por defecto
    });
    return res
      .status(201)
      .json({ message: "Usuario creado exitosamente", user: newUser });
  } catch (error) {
    console.log(`Error en el servidor al crear un usuario, error: ${error}`);
    return res.status(500).json({ message: "Error en el servidor.. ", error });
  }
}
