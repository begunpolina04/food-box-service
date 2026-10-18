const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { User } = require("../models");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "email", "role", "createdAt"],
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
