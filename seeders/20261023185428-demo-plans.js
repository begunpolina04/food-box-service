"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Plans", [
      {
        title: "Семейный бокс",
        price: 150,
        persons: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Фитнес & Протеин",
        price: 127,
        persons: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Plans", null, {});
  },
};
