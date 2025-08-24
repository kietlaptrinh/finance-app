// backend/src/controllers/savingGoalController.js
const savingGoalService = require('../services/savingGoalService');

const createSavingGoal = async (req, res) => {
  try {
    const goal = await savingGoalService.createSavingGoal(req.user.userId, req.body);
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateSavingGoal = async (req, res) => {
  try {
    const goal = await savingGoalService.updateSavingGoal(req.user.userId, req.params.id, req.body);
    res.json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSavingGoals = async (req, res) => {
  try {
    const goals = await savingGoalService.getSavingGoals(req.user.userId);
    res.json(goals);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteSavingGoal = async (req, res) => {
  try {
    await savingGoalService.deleteSavingGoal(req.user.userId, req.params.id); // Giả sử thêm method delete trong service
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const depositToGoal = async (req, res) => {
    try {
        const { amount } = req.body;
        const goal = await savingGoalService.depositToGoal(
            req.user.userId,
            req.params.id,
            parseFloat(amount)
        );
        res.json(goal);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { createSavingGoal, updateSavingGoal, getSavingGoals, deleteSavingGoal, depositToGoal, };