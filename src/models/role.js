import sequelize from "../config/database.js";
import { DataTypes, Model } from "sequelize";

class Role extends Model {
  // es opcional
  static id;
  static name; //enum
  static description;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "Roles",
    timestamps: false,
  },
);

export default Role;
