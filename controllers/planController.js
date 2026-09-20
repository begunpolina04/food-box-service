const { Plan } = require("../models");

// GET /api/plans - получить все планы
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/plans/:id - получить план по ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: "Элемент не найден" });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/plans - создать новый план
exports.createPlan = async (req, res) => {
  try {
    const newPlan = await Plan.create(req.body);
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/plans/:id - обновить план
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: "Элемент не найден" });
    }
    await plan.update(req.body);
    res.status(200).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/plans/:id - удалить план
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: "Элемент не найден" });
    }
    await plan.destroy();
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
