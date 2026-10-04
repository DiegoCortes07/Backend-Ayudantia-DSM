import Local from "../../models/local.js";

const locals = [
  {
    id: 1,
    name: "Local Centro",
    address: "Av. Arturo Prat 450, Antofagasta",
    latitude: -23.65094,
    longitude: -70.39752,
    is_active: true,
  },
  {
    id: 2,
    name: "Local Norte",
    address: "Av. Pedro Aguirre Cerda 7100, Antofagasta",
    latitude: -23.59665,
    longitude: -70.38831,
    is_active: true,
  },
];

export async function seedLocals(transaction) {
  const count = await Local.count({ transaction });

  if (count > 0) {
    console.log("Seed omitido para Locals: ya existen datos");
    return;
  }

  await Local.bulkCreate(locals, { transaction });
  console.log("Seed ejecutado para Locals");
}
