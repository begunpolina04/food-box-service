const { Plan } = require("../models");

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

exports.createPlan = async (req, res) => {
  try {
    const newPlan = await Plan.create(req.body);
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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