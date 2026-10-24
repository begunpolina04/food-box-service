"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Subscription, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Log, { foreignKey: "userId", onDelete: "SET NULL" });
    }
  }
  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: "user" },
    },
    { sequelize, modelName: "User" },
  );
  return User;
};
