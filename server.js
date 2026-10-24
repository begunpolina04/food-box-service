const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 3000;

const logger = require("./middleware/logger");
const validatePlan = require("./middleware/validatePlan");
const validateEmail = require("./middleware/validateEmail");
const { writeLog } = require("./middleware/dbLogger");
const { Plan, User, Subscription, Log } = require("./models");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "super_secret_key_123",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || { name: "Гость", role: "guest" };
  next();
});

app.use(logger);

// ================= АУТЕНТИФИКАЦИЯ =================

app.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.render("login", { error: "Неверный email или пароль" });
    }

    req.session.user = { id: user.id, name: user.name, role: user.role };
    await writeLog(req, "LOGIN", `Вход в систему: ${user.email}`);
    res.redirect("/");
  } catch (error) {
    res.render("login", { error: "Ошибка сервера при входе" });
  }
});

app.get("/register", (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("register", { error: null });
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 2 || name.length > 50) {
      return res.render("register", {
        error: "Имя должно быть от 2 до 50 символов",
      });
    }

    if (!email || !validateEmail(email)) {
      return res.render("register", {
        error: "Введите реальный Email (пример: user@mail.ru)",
      });
    }

    if (!password || password.length < 6 || password.length > 50) {
      return res.render("register", {
        error: "Пароль должен быть от 6 до 50 символов",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render("register", {
        error: "Пользователь с таким email уже существует",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: "user",
    });

    req.session.user = {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
    };
    await writeLog(req, "REGISTER", `Успешная регистрация: ${newUser.email}`);
    res.redirect("/");
  } catch (error) {
    res.render("register", { error: "Ошибка при регистрации" });
  }
});

app.get("/logout", (req, res) => {
  writeLog(req, "LOGOUT", "Выход из системы");
  req.session.destroy(() => res.redirect("/"));
});

// ================= МИДЛВАРЫ ДОСТУПА =================

const requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") return next();
  res.redirect("/login");
};

const requireAuth = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/login");
};

// ================= ОСНОВНЫЕ МАРШРУТЫ =================

app.get("/", async (req, res) => {
  try {
    let whereClause = {};
    if (res.locals.user.role !== "admin") whereClause.isActive = true;

    const plans = await Plan.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
    });
    const editingPlan = req.query.edit
      ? await Plan.findByPk(req.query.edit)
      : null;

    let userSubscriptions = [];
    if (req.session.user && req.session.user.role === "user") {
      const subs = await Subscription.findAll({
        where: { userId: req.session.user.id, status: "active" },
      });
      userSubscriptions = subs.map((s) => s.planId);
    }

    res.render("index", {
      plans,
      editingPlan,
      userSubscriptions,
      isEditing: !!editingPlan,
    });
  } catch (error) {
    console.error("ОШИБКА НА ГЛАВНОЙ:", error);
    res.status(500).render("500");
  }
});

app.get("/item/:id", async (req, res, next) => {
  const plan = await Plan.findByPk(req.params.id);
  if (!plan) return next();
  res.render("item", { plan });
});

// ================= ЛОГИКА ПОДПИСОК =================

app.post("/subscribe/:planId", requireAuth, async (req, res) => {
  try {
    const planId = req.params.planId;
    const userId = req.session.user.id;

    const existingSub = await Subscription.findOne({
      where: { userId, planId, status: "active" },
    });

    if (!existingSub) {
      await Subscription.create({ userId, planId, status: "active" });
      await writeLog(
        req,
        "SUBSCRIBE",
        `Оформлена подписка на план ID: ${planId}`,
      );
    }
    res.redirect("/my-subscriptions");
  } catch (error) {
    console.error(error);
    res.status(500).render("500");
  }
});

app.get("/my-subscriptions", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const subscriptions = await Subscription.findAll({
      where: { userId, status: "active" },
      include: [{ model: Plan }],
      order: [["createdAt", "DESC"]],
    });
    res.render("subscriptions", { subscriptions });
  } catch (error) {
    console.error(error);
    res.status(500).render("500");
  }
});

// ================= АДМИНСКИЕ МАРШРУТЫ =================

app.get("/admin/logs", requireAdmin, async (req, res) => {
  try {
    const logs = await Log.findAll({
      include: [{ model: User }],
      order: [["createdAt", "DESC"]],
      limit: 100,
    });
    res.render("logs", { logs });
  } catch (error) {
    console.error(error);
    res.status(500).render("500");
  }
});

app.get("/admin/subscriptions", requireAdmin, async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { status: "active" },
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: Plan, attributes: ["title", "price"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.render("admin-subscriptions", { subscriptions });
  } catch (error) {
    console.error("ОШИБКА ПРИ ЗАГРУЗКЕ ПОДПИСОК:", error);
    res.status(500).send(`
      <h1>Ошибка при загрузке подписок</h1>
      <p>Подробности в консоли терминала.</p>
      <a href="/">Вернуться на главную</a>
    `);
  }
});

app.post("/add", requireAdmin, validatePlan, async (req, res) => {
  await Plan.create({
    title: req.body.title.trim(),
    price: Number(req.body.price),
    persons: Number(req.body.persons),
    description: req.body.description ? req.body.description.trim() : null,
    composition: req.body.composition ? req.body.composition.trim() : null,
    isActive: true,
  });
  await writeLog(req, "ADD_PLAN", `Создан план: "${req.body.title}"`);
  res.redirect("/");
});

app.post("/edit/:id", requireAdmin, validatePlan, async (req, res) => {
  const plan = await Plan.findByPk(req.params.id);
  if (plan) {
    await plan.update({
      title: req.body.title.trim(),
      price: Number(req.body.price),
      persons: Number(req.body.persons),
      description: req.body.description ? req.body.description.trim() : null,
      composition: req.body.composition ? req.body.composition.trim() : null,
    });
    await writeLog(req, "EDIT_PLAN", `Изменен план ID: ${plan.id}`);
  }
  res.redirect("/");
});

app.get("/delete/:id", requireAdmin, async (req, res) => {
  const plan = await Plan.findByPk(req.params.id);
  if (plan) {
    await writeLog(req, "DELETE_PLAN", `Удален план: "${plan.title}"`);
    await plan.destroy();
  }
  res.redirect("/");
});

app.get("/toggle/:id", requireAdmin, async (req, res) => {
  const plan = await Plan.findByPk(req.params.id);
  if (plan) {
    await plan.update({ isActive: !plan.isActive });
    await writeLog(
      req,
      "TOGGLE_PLAN",
      `План "${plan.title}" теперь ${plan.isActive ? "активен" : "скрыт"}`,
    );
  }
  res.redirect("/");
});

// ================= ОШИБКИ =================
app.use((req, res) => res.status(404).render("404"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500");
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});
