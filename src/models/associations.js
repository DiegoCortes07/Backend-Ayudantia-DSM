import Role from "./role.js";
import User from "./user.js";

// definir las asociaciones, pero con una funcion

export function initializeAssociations() {
  // un rol tiene muchos usuario
  Role.hasMany(User, { foreignKey: "roleId" });
  // un usuario pertenece a un rol
  User.belongsTo(Role, { foreignKey: "roleId" });
}
