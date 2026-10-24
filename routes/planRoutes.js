const express = require("express");
const router = express.Router();
const validatePlan = require("../middleware/validatePlan");

let plans = [
  {
    id: 1,
    title: "Семейный бокс",
    description: "Набор ужинов на 4 человек на 5 дней",
    pricePerWeek: 150,
    persons: 4,
  },
  {
    id: 2,
    title: "Фитнес & Протеин",
    description: "Сбалансированные блюда с высоким содержанием белка",
    pricePerWeek: 127,
    persons: 1,
  },
  {
    id: 3,
    title: "Вегетарианский бокс",
    description: "Разнообразные блюда без мяса и птицы",
    pricePerWeek: 107,
    persons: 2,
  },
];

let currentId = 4;

router.get("/", (req, res) => {
  res.render("index", { plans, user: req.user });
});

router.get("/item/:id", (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next();
  }

  const plan = plans.find((p) => p.id === id);

  if (!plan) {
    return next();
  }

  res.render("item", { plan, user: req.user });
});

router.get("/add", (req, res) => {
  res.render("add", { user: req.user, errors: {}, values: {} });
});

router.post("/add", validatePlan, (req, res) => {
  const { title, description, pricePerWeek, persons } = req.body;

  const newPlan = {
    id: currentId++,
    title,
    description,
    pricePerWeek,
    persons,
  };

  plans.push(newPlan);
  res.redirect("/");
});

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

module.exports = router;
