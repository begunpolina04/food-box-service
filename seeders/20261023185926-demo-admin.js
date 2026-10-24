"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("admin", 10);
    await queryInterface.bulkInsert("Users", [
      {
        name: "Главный Администратор",
        email: "admin@mail.com",
        passwordHash: passwordHash,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { email: "admin@mail.com" }, {});
  },
};
