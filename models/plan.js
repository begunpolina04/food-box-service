"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    static associate(models) {
      Plan.hasMany(models.Subscription, {
        foreignKey: "planId",
        onDelete: "CASCADE",
      });
    }
  }
  Plan.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [3, 50] },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 1000000 },
      },
      persons: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      composition: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { sequelize, modelName: "Plan" },
  );
  return Plan;
};
