import sequelize from "../config/database.js";
import { DataTypes, Model } from "sequelize";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: "es",
    },
    theme: {
      type: DataTypes.ENUM("light", "dark", "automatic"),
      defaultValue: "light",
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Roles",
        key: "id",
      },
      status: {
        type: DataTypes.ENUM("active", "suspend", "unconfirmed"),
        allowNull: false,
        defaultValue: "active",
      },
    },
  },
  { sequelize, modelName: "User", tableName: "Users", timestamps: false },
);

export default User;
