import Local from "../models/local.js";

export async function getLocals(req, res) {
  try {
    const locals = await Local.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json(locals);
  } catch (error) {
    console.error("Error al obtener los locales", error);
    return res.status(500).json({ message: "Error al obtener los locales" });
  }
}

export async function createLocal(req, res) {
  try {
    const { name, address, latitude, longitude, is_active } = req.body;
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (!name || !address) {
      return res.status(400).json({ message: "Campos insuficientes.." });
    }

    if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
      return res.status(400).json({ message: "Coordenadas invalidas" });
    }

    const newLocal = await Local.create({
      name,
      address,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      is_active: is_active ?? true,
    });

    return res.status(201).json(newLocal);
  } catch (error) {
    console.error("Error al crear el local", error);
    return res.status(500).json({ message: "Error al crear el local" });
  }
}
