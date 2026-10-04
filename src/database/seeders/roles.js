import Role from "../../models/role.js";

const roles = [
  {
    id: 1,
    name: "Usuario",
    description: "Usuario regular de la aplicacion",
  },
  {
    id: 2,
    name: "Admin",
    description: "Administrador de la aplicacion",
  },
];

export async function seedRoles(transaction) {
  const count = await Role.count({ transaction });

  if (count > 0) {
    console.log("Seed omitido para Roles: ya existen datos");
    return;
  }

  await Role.bulkCreate(roles, { transaction });
  console.log("Seed ejecutado para Roles");
}
