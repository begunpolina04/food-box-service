const express = require("express");
const app = express();
const PORT = 3000;

const planRoutes = require("./routes/planRoutes");

app.use(express.json());

app.use("/api/plans", planRoutes);

// Обработка несуществующих маршрутов (404)
app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

// Глобальный обработчик ошибок (500)
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
