// backend/src/controllers/settingController.js
const settingService = require('../services/settingService');

const getSettings = async (req, res) => {
  try {
    const settings = await settingService.getSettings(req.user.userId);
    console.log('Settings fetched from DB:', settings.toJSON());
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteChallenge = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('req.user:', req.user);
    const { userChallengeId } = req.body;
    const userId = req.user?.userId; 
    if (!userId) throw new Error('User ID is not authenticated');
    const result = await settingService.deleteChallenge(userId, userChallengeId);
    res.json(result);
  } catch (err) {
    console.error('Delete challenge error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await settingService.updateSettings(req.user.userId, req.body);
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await settingService.createCategory(req.user.userId, req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const exportData = async (req, res) => {
  try {
    const data = await settingService.exportData(req.user.userId);
    res.json(data); // Hoặc gửi file CSV
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await settingService.deleteAccount(req.user.userId);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCategories = async (req, res) => {
    console.log("🔥 GET /settings/category hit");
  try {
    const categories = await settingService.getCategories(req.user.userId);
    res.json(categories);
  } catch (err) {
    console.error("Error in getCategories:", err);
    res.status(400).json({ message: err.message });
  }
};

const getChallenges = async (req, res) => {
  console.log('GET /settings/challenges hit for user:', req.user.userId);
  try {
    const challenges = await settingService.getChallenges(req.user.userId);
    res.json(challenges);
  } catch (err) {
    console.error('Error in getChallenges:', err);
    res.status(400).json({ message: err.message });
  }
};

const completeChallenge = async (req, res) => {
  try {
    const { userChallengeId } = req.body;
    console.log('Received userChallengeId:', userChallengeId, 'for user:', req.user.userId, 'req.body:', req.body);
    if (typeof userChallengeId !== 'number') {
      throw new Error('Invalid userChallengeId format');
    }
    const result = await settingService.completeChallenge(req.user.userId, userChallengeId);
    res.json(result);
  } catch (err) {
    console.error('Error in completeChallenge:', err);
    res.status(400).json({ message: err.message });
  }
};

const createBudgetRule = async (req, res) => {
  try {
    const rule = await settingService.createBudgetRule(req.user.userId, req.body);
    res.status(201).json(rule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getBudgetRules = async (req, res) => {
  try {
    console.log('Fetching budget rules for user:', req.user.userId);
    const rules = await settingService.getBudgetRules(req.user.userId);
    console.log('Budget rules:', rules);
    res.json(rules);
  } catch (err) {
    console.error('Error in getBudgetRules:', err);
    res.status(400).json({ message: err.message });
  }
};

const deleteBudgetRule = async (req, res) => {
  try {
    await settingService.deleteBudgetRule(req.user.userId, req.params.ruleId);
    res.json({ message: 'Rule deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const syncGoogleCalendar = async (req, res) => {
  try {
    const { code } = req.body;
    const tokens = await settingService.syncGoogleCalendar(req.user.userId, code);
    res.json({ message: 'Google Calendar synced', tokens });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const fetchCalendarEvents = async (req, res) => {
  try {
    console.log('Fetching calendar events for user:', req.user.userId);
    const events = await settingService.fetchCalendarEvents(req.user.userId);
    console.log('Calendar events:', events);
    res.json(events);
  } catch (err) {
    console.error('Error fetching calendar events:', err);
    res.status(400).json({ message: err.message });
  }
};

const convertPointsToBalance = async (req, res) => {
  try {
    const { points } = req.body;
    if (typeof points !== 'number' || points < 100) {
      throw new Error('Số điểm không hợp lệ, phải tối thiểu 100 điểm');
    }
    if (points % 100 !== 0) {
      throw new Error('Số điểm phải là bội số của 100');
    }
    const result = await settingService.convertPointsToBalance(req.user.userId, points);
    res.json(result);
  } catch (err) {
    console.error('Error in convertPointsToBalance:', err);
    res.status(400).json({ message: err.message });
  }
};


const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await settingService.getLeaderboard();
    res.json(leaderboard);
  } catch (err) {
    console.error('Error in getLeaderboard:', err);
    res.status(400).json({ message: err.message });
  }
};

const getLeaderboardHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await settingService.getLeaderboardHistory(userId);
    res.json(history);
  } catch (err) {
    console.error('Error in getLeaderboardHistory:', err);
    res.status(400).json({ message: err.message });
  }
};



module.exports = { 
  getSettings,
   updateSettings,
   createCategory,
    exportData,
     deleteAccount,
    getCategories ,
    getChallenges,
     completeChallenge,
    createBudgetRule,
     deleteChallenge,
  getBudgetRules,
  deleteBudgetRule,
  syncGoogleCalendar,
  fetchCalendarEvents,
  convertPointsToBalance,
   getLeaderboard,
  getLeaderboardHistory
};