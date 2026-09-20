let plans = require("../models/planModel");

exports.getAllPlans = (req, res) => {
  res.status(200).json(plans);
};

exports.getPlanById = (req, res) => {
  const plan = plans.find((p) => p.id === Number(req.params.id));
  if (!plan) {
    return res.status(404).json({ error: "Элемент не найден" });
  }
  res.status(200).json(plan);
};

exports.createPlan = (req, res) => {
  const newPlan = {
    id: plans.length > 0 ? plans[plans.length - 1].id + 1 : 1,
    ...req.body,
  };
  plans.push(newPlan);
  res.status(201).json(newPlan);
};

exports.updatePlan = (req, res) => {
  const index = plans.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Элемент не найден" });
  }
  plans[index] = { id: Number(req.params.id), ...req.body };
  res.status(200).json(plans[index]);
};

exports.deletePlan = (req, res) => {
  const index = plans.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Элемент не найден" });
  }
  const deletedPlan = plans.splice(index, 1)[0];
  res.status(200).json(deletedPlan);
};
