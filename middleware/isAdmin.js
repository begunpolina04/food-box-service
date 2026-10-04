module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Не авторизован" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Доступ запрещён. Только для администраторов" });
  }

  next();
};
