"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Plans", [
      {
        title: "Семейный бокс",
        description: "Набор ужинов на 4 человек на 5 дней с простыми рецептами",
        pricePerWeek: 4500.0,
        mealsPerWeek: 5,
        persons: 4,
        isActive: true,
        servingsPerWeek: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Фитнес & Протеин",
        description:
          "Сбалансированные блюда с высоким содержанием белка и подсчетом КБЖУ",
        pricePerWeek: 3800.0,
        mealsPerWeek: 6,
        persons: 1,
        isActive: true,
        servingsPerWeek: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Вегетарианский бокс",
        description: "Разнообразные блюда без мяса и птицы, богатые клетчаткой",
        pricePerWeek: 3200.0,
        mealsPerWeek: 5,
        persons: 2,
        isActive: true,
        servingsPerWeek: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Plans", null, {});
  },
};
