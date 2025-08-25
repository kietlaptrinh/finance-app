const { Budget, Category } = require('../models');


const createBudget = async (userId, data) => {
  const { categoryId, amount, period, startDate, endDate } = data;
  const category = await Category.findOne({ where: { categoryId, userId } }); // Chỉ category của user
  if (!category) throw new Error('Invalid category');
  return await Budget.create({ userId, categoryId, amount, period, startDate, endDate });
};

const updateBudget = async (userId, budgetId, data) => {
  const budget = await Budget.findOne({ where: { budgetId, userId } });
  if (!budget) throw new Error('Budget not found');
  await budget.update(data);
  return budget;
};

const deleteBudget = async (userId, budgetId) => {
  const budget = await Budget.findOne({ where: { budgetId, userId } });
  if (!budget) throw new Error('Budget not found');
  await budget.destroy();
};

const getBudgets = async (userId) => {
  return await Budget.findAll({ where: { userId }, include: [{ model: Category }] });
};

module.exports = { createBudget, updateBudget, deleteBudget, getBudgets };