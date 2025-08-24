const budgetService = require('../services/budgetService');

const createBudget = async (req, res) => {
  try {
    const budget = await budgetService.createBudget(req.user.userId, req.body);
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const budget = await budgetService.updateBudget(req.user.userId, req.params.id, req.body);
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    await budgetService.deleteBudget(req.user.userId, req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getBudgets = async (req, res) => {
  try {
    const budgets = await budgetService.getBudgets(req.user.userId);
    res.json(budgets);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createBudget, updateBudget, deleteBudget, getBudgets };