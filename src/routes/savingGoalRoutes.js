const express = require('express');
const router = express.Router();
const savingGoalController = require('../controllers/savingGoalController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', savingGoalController.createSavingGoal);
router.put('/:id', savingGoalController.updateSavingGoal);
router.get('/', savingGoalController.getSavingGoals);
router.delete('/:id', savingGoalController.deleteSavingGoal);
router.post('/:id/deposit', savingGoalController.depositToGoal);

module.exports = router;