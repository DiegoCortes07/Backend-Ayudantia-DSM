import bcrypt from "bcrypt";
import User from "../../models/user.js";

export async function seedUsers(transaction) {
  const count = await User.count({ transaction });

  if (count > 0) {
    console.log("Seed omitido para Users: ya existen datos");
    return;
  }

  const passwordHash = await bcrypt.hash("password123", 10);

  await User.bulkCreate(
    [
      {
        id: 1,
        email: "admin@example.com",
        password: passwordHash,
        name: "Administrador",
        username: "admin",
        phone: "111111111",
        profile_picture: null,
        language: "es",
        theme: "light",
        roleId: 2,
        status: "active",
      },
      {
        id: 2,
        email: "diego@example.com",
        password: passwordHash,
        name: "Diego",
        username: "diego_user",
        phone: "1234567890",
        profile_picture: null,
        language: "es",
        theme: "light",
        roleId: 1,
        status: "active",
      },
    ],
    { transaction },
  );

  console.log("Seed ejecutado para Users");
}
