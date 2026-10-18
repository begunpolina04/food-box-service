const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const { User } = require("../models");

router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "role", "createdAt"],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
