const { UserSetting, Category, User, UserChallenge, Challenge, BudgetRule, Transaction, Leaderboard, LeaderboardHistory } = require('../models');
const { Op } = require('sequelize');
const cron = require('node-cron');


const getSettings = async (userId) => {
  let setting = await UserSetting.findOne({ where: { userId } });
  if (!setting) {
    setting = await UserSetting.create({ userId });
  }
  return setting;
};

const updateSettings = async (userId, data) => {
  const setting = await getSettings(userId);
  await setting.update(data);
  return setting;
};

const createCategory = async (userId, data) => {
  return await Category.create({ ...data, userId, isDefault: false });
};

const exportData = async (userId) => {
  // Logic xuất CSV, sử dụng csv-writer hoặc tương tự
  const transactions = await Transaction.findAll({ where: { userId } });
  // Giả sử return JSON, implement CSV thực tế
  return transactions;
};

const deleteAccount = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  await user.destroy(); // Cascade delete tất cả liên quan
};

const getCategories = async (userId) => {
  return await Category.findAll({
    where: {
      [Op.or]: [{ userId }, { isDefault: true }],
    },
  });
};

const getChallenges = async (userId) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Lấy thử thách hiện tại của người dùng
  let userChallenges = await UserChallenge.findAll({
    where: { userId, status: { [Op.in]: ['pending', 'completed'] } },
    include: [{ model: Challenge }],
  });

  // Làm mới thử thách nếu chưa có hoặc đã hết hạn
  const activeChallenges = userChallenges.filter(uc => {
    const endDate = new Date(uc.endDate);
    return endDate >= today;
  });

  if (activeChallenges.length < 3) {
    await UserChallenge.destroy({ where: { userId, status: 'pending' } });
    const availableChallenges = await Challenge.findAll();
    const randomChallenges = availableChallenges.sort(() => 0.5 - Math.random()).slice(0, 3);
    for (const challenge of randomChallenges) {
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + challenge.durationDays);
      await UserChallenge.create({
        userId,
        challengeId: challenge.challengeId,
        startDate: today,
        endDate,
        status: 'pending',
      });
    }
  }

  // Lấy lại danh sách thử thách
  userChallenges = await UserChallenge.findAll({
    where: { userId, status: { [Op.in]: ['pending', 'completed'] } },
    include: [{ model: Challenge }],
  });

  return userChallenges.map(uc => ({
    userChallengeId: uc.userChallengeId,
    description: uc.Challenge.description,
    rewardPoints: uc.Challenge.rewardPoints,
    durationDays: uc.Challenge.durationDays,
    category: uc.Challenge.category,
    status: uc.status,
    startDate: uc.startDate,
    endDate: uc.endDate,
    completedAt: uc.completedAt,
  }));
};

const deleteChallenge = async (userId, userChallengeId) => {
  console.log('Deleting challenge with userId:', userId, 'and userChallengeId:', userChallengeId);
  const userChallenge = await UserChallenge.findOne({
    where: { userChallengeId, userId, status: 'completed' },
  });
  if (!userChallenge) throw new Error('Challenge not found or not completed');
  await userChallenge.destroy();
  return { message: 'Challenge deleted successfully' };
};

const completeChallenge = async (userId, userChallengeId) => {
  const userChallenge = await UserChallenge.findOne({
    where: { userChallengeId, userId, status: 'pending' },
    include: [Challenge],
  });
  if (!userChallenge) throw new Error('Challenge not found or already completed');

  const now = new Date();
  await userChallenge.update({ status: 'completed', completedAt: now, rewardReceived: true });

  const setting = await getSettings(userId);
  console.log('Settings before update:', setting.toJSON());
  const newPoints = (setting.points || 0) + userChallenge.Challenge.rewardPoints;
  const newBadges = [...(setting.badges || [])];
  if (userChallenge.Challenge.category && !newBadges.includes(userChallenge.Challenge.category)) {
    newBadges.push(userChallenge.Challenge.category);
  }
  await setting.update({ points: newPoints, badges: newBadges });
  await updateLeaderboard(userId);
console.log('Settings after update:', (await getSettings(userId)).toJSON());
  return { points: newPoints, badges: newBadges };
};

const convertPointsToBalance = async (userId, points) => {
  const setting = await UserSetting.findOne({ where: { userId } });
  if (!setting) throw new Error('User settings not found');
  if (setting.points < points) {
    throw new Error('Không đủ điểm để quy đổi');
  }
  const amount = (points / 100) * 10000; // 100 điểm = 10.000 VND
  const newPoints = setting.points - points;

  // Tìm danh mục mặc định "Thu nhập" hoặc tạo mới nếu chưa có
  let incomeCategory = await Category.findOne({
    where: { userId, type: 'income', isDefault: true }
  });
  if (!incomeCategory) {
    incomeCategory = await Category.create({
      userId,
      name: 'Thu nhập từ quy đổi điểm',
      type: 'income',
      isDefault: true
    });
  }

  // Tạo giao dịch income
  await Transaction.create({
    userId,
    categoryId: incomeCategory.categoryId,
    amount,
    transactionDate: new Date(),
    type: 'income',
    note: `Quy đổi ${points} điểm thành ${amount} VND`
  });

  // Cập nhật điểm
  await setting.update({ points: newPoints });
    await updateLeaderboard(userId);

  // Tính số dư mới
  const transactions = await Transaction.findAll({ where: { userId } });
  const balance = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + parseFloat(t.amount) : sum - parseFloat(t.amount);
  }, 0);

  return { points: newPoints, balance, message: 'Quy đổi điểm thành công' };
};


const createBudgetRule = async (userId, data) => {
  const { categoryId, eventType, adjustmentType, adjustmentValue, startDate, endDate } = data;
  const category = await Category.findOne({
    where: { categoryId, [Op.or]: [{ userId }, { isDefault: true }] }
  });
  if (!category) throw new Error('Invalid category');
  return await BudgetRule.create({
    userId,
    categoryId,
    eventType,
    adjustmentType,
    adjustmentValue,
    startDate,
    endDate
  });
};

const getBudgetRules = async (userId) => {
  return await BudgetRule.findAll({
    where: { userId },
    include: [{ model: Category }],
    order: [['startDate', 'ASC']]
  });
};

const deleteBudgetRule = async (userId, ruleId) => {
  const rule = await BudgetRule.findOne({ where: { ruleId, userId } });
  if (!rule) throw new Error('Rule not found');
  await rule.destroy();
};

const syncGoogleCalendar = async (userId, code) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:5000/api/settings/google-callback'
  );

  const { tokens } = await oauth2Client.getToken(code);
  await UserSetting.update(
    { googleCalendarToken: tokens },
    { where: { userId } }
  );

  return tokens;
};

const fetchCalendarEvents = async (userId) => {
  const setting = await getSettings(userId);
  let events = [];
  if (setting.googleCalendarToken) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:5000/api/settings/google-callback'
    );
    oauth2Client.setCredentials(setting.googleCalendarToken);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      timeMax: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });
    events = response.data.items.map(event => ({
      summary: event.summary || 'No title',
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date
    }));
  }
  return events;
};


const calculateSpeedScore = async (userId) => {
  const userChallenges = await UserChallenge.findAll({
    where: { userId, status: 'completed' },
    include: [Challenge]
  });
  if (userChallenges.length === 0) return 0;

  let totalSpeedScore = 0;
  for (const uc of userChallenges) {
    const startDate = new Date(uc.startDate);
    const endDate = new Date(uc.endDate);
    const completedAt = new Date(uc.completedAt);
    const totalDuration = (endDate - startDate) / (1000 * 60 * 60 * 24); // days
    const timeTaken = (completedAt - startDate) / (1000 * 60 * 60 * 24);
    const speedRatio = 1 - (timeTaken / totalDuration); // Tỷ lệ thời gian còn lại
    totalSpeedScore += speedRatio * 100; // Scale to 0-100
  }
  return (totalSpeedScore / userChallenges.length).toFixed(2);
};

const calculateStarRating = (rankScore) => {
  if (rankScore >= 100) return 5;
  if (rankScore >= 80) return 4;
  if (rankScore >= 60) return 3;
  if (rankScore >= 40) return 2;
  return 1;
};

const getCurrentSeason = () => {
  const now = new Date();
  const startDate = new Date('2025-01-01');
  const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  return Math.floor(daysSinceStart / 30) + 1;
};

const updateLeaderboard = async (userId) => {
  const setting = await UserSetting.findOne({ where: { userId } });
  const completedChallenges = await UserChallenge.count({
    where: { userId, status: 'completed' }
  });
  const speedScore = await calculateSpeedScore(userId);
  const rankScore = (setting.points * 0.6) + (completedChallenges * 0.3) + (speedScore * 0.1);

  const currentSeason = getCurrentSeason();
  await Leaderboard.upsert({
    userId,
    season: currentSeason,
    rankScore: rankScore.toFixed(2),
    totalPoints: setting.points,
    completedChallenges,
    speedScore,
    createdAt: new Date()
  });

  // Lưu vào lịch sử
  const starRating = calculateStarRating(rankScore);
  await LeaderboardHistory.create({
    userId,
    season: currentSeason,
    rankScore: rankScore.toFixed(2),
    totalPoints: setting.points,
    completedChallenges,
    speedScore,
    starRating,
    createdAt: new Date()
  });
};

// Reset Leaderboard mỗi 30 ngày
cron.schedule('0 0 1 * *', async () => {
  const currentSeason = getCurrentSeason();
  await Leaderboard.destroy({ where: { season: currentSeason - 1 } });
  const users = await User.findAll();
  for (const user of users) {
    await updateLeaderboard(user.userId);
  }
});

const getLeaderboard = async () => {
  const currentSeason = getCurrentSeason();
  const leaderboard = await Leaderboard.findAll({
    where: { season: currentSeason },
    include: [{ model: User, attributes: ['userId', 'fullName', 'profilePictureUrl'] }],
    order: [['rankScore', 'DESC']],
    limit: 10
  });

  const leaderboardWithStars = await Promise.all(leaderboard.map(async (entry) => {
    const history = await LeaderboardHistory.findAll({ where: { userId: entry.userId } });
    const avgStarRating = history.length > 0
  ? (history.reduce((sum, h) => sum + h.starRating, 0) / history.length).toFixed(1)
  : calculateStarRating(entry.rankScore).toFixed(1);
  
    return {
      userId: entry.userId,
      fullName: entry.User.fullName,
      profilePictureUrl: entry.User.profilePictureUrl,
      rankScore: entry.rankScore,
      totalPoints: entry.totalPoints,
      completedChallenges: entry.completedChallenges,
      speedScore: entry.speedScore,
      avgStarRating
    };
  }));

  return leaderboardWithStars;
};

const getLeaderboardHistory = async (userId) => {
  const history = await LeaderboardHistory.findAll({
    where: { userId },
    order: [['season', 'DESC']]
  });
  return history.map(h => ({
    season: h.season,
    rankScore: h.rankScore,
    totalPoints: h.totalPoints,
    completedChallenges: h.completedChallenges,
    speedScore: h.speedScore,
    starRating: h.starRating,
    createdAt: h.createdAt
  }));
};

module.exports = {
   getSettings,
   updateSettings,
   createCategory,
    exportData,
    deleteAccount,
     getCategories,
     getChallenges,
      completeChallenge,
     convertPointsToBalance,
     createBudgetRule,
      deleteChallenge,
  getBudgetRules,
  deleteBudgetRule,
  syncGoogleCalendar,
  fetchCalendarEvents,
  getLeaderboard,
  getLeaderboardHistory
};