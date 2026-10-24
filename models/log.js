"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {
      Log.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Log.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: true },
      action: { type: DataTypes.STRING, allowNull: false },
      details: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "Log" },
  );
  return Log;
};
