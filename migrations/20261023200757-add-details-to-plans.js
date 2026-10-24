"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Plans", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Plans", "composition", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Plans", "description");
    await queryInterface.removeColumn("Plans", "composition");
  },
};
