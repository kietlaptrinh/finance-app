const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', settingController.getSettings);
router.put('/', settingController.updateSettings);
router.post('/category', settingController.createCategory);
router.get('/category', settingController.getCategories);
router.get('/challenges', settingController.getChallenges);
router.delete('/challenges/delete', settingController.deleteChallenge);
router.post('/challenges/complete', settingController.completeChallenge);
router.get('/export', settingController.exportData);
router.delete('/account', settingController.deleteAccount);
router.post('/budget-rule', settingController.createBudgetRule);
router.get('/budget-rules', settingController.getBudgetRules);
router.delete('/budget-rule/:ruleId', settingController.deleteBudgetRule);
router.post('/google-calendar-sync', settingController.syncGoogleCalendar);
router.get('/calendar-events', settingController.fetchCalendarEvents);
router.post('/convert-points', settingController.convertPointsToBalance);
router.get('/leaderboard', settingController.getLeaderboard);
router.get('/leaderboard/history/:userId', settingController.getLeaderboardHistory);


module.exports = router;