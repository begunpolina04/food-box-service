const { Sequelize } = require("sequelize");
const config = require("./config/config.json").development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
  },
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Подключение к PostgreSQL успешно!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка подключения:", error.message);
    process.exit(1);
  }
})();
