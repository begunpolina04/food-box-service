const { Log } = require("../models");

const writeLog = async (req, action, details = "") => {
  try {
    const userId = req.session.user ? req.session.user.id : null;
    await Log.create({ userId, action, details });
  } catch (error) {
    console.error("Ошибка записи лога:", error);
  }
};

module.exports = { writeLog };
