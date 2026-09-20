"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    static associate(models) {
      // здесь будут связи (пока нет)
    }
  }

  Plan.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pricePerWeek: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      mealsPerWeek: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      persons: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      servingsPerWeek: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Plan",
    },
  );

  return Plan;
};
