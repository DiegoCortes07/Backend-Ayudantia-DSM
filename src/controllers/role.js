import Role from "../models/role.js";

// Funciones para el modelo ROLE

export async function getRoles(req, res) {
  try {
    const roles = await Role.findAll();
    if (roles.length === 0) {
      return res.status(400).json({ message: "No se encontraron roles" });
    }
    return res.status(200).json(roles);
  } catch (error) {
    console.error("Error al obtener los roles", error);
    return res.status(500).json({ message: "Error al obtener los roles" });
  }
}

export async function createRole(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "El nombre del rol es requerido" });
    }

    const newRole = await Role.create({
      name: name,
      description: description || null,
    });

    return res.status(201).json(newRole);
  } catch (error) {
    console.error("Error al crear el rol", error);
    return res.status(500).json({ message: "Error al crear el rol" });
  }
}
