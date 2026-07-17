import Role from "./role.js";
import User from "./user.js";
import Product from "./product.js";
import Local from "./local.js";
import Order from "./order.js";

// definir las asociaciones, pero con una funcion

export function initializeAssociations() {
  // un rol tiene muchos usuario
  Role.hasMany(User, { foreignKey: "roleId" });
  // un usuario pertenece a un rol
  User.belongsTo(Role, { foreignKey: "roleId" });

  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
  Order.belongsTo(User, { foreignKey: "userId", as: "user" });

  Product.hasMany(Order, { foreignKey: "productId", as: "orders" });
  Order.belongsTo(Product, { foreignKey: "productId", as: "product" });

  Local.hasMany(Order, { foreignKey: "localId", as: "orders" });
  Order.belongsTo(Local, { foreignKey: "localId", as: "local" });
}
