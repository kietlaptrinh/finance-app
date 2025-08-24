const { Challenge, UserChallenge, PiggyBank } = require('../models');

const getRandomChallenge = async () => {
  const challenges = await Challenge.findAll();
  return challenges[Math.floor(Math.random() * challenges.length)];
};

const startChallenge = async (userId, challengeId) => {
  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) throw new Error('Challenge not found');
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + challenge.durationDays);
  return await UserChallenge.create({ userId, challengeId, startDate, endDate });
};

const completeChallenge = async (userId, userChallengeId) => {
  const userChallenge = await UserChallenge.findOne({ where: { userChallengeId, userId } });
  if (!userChallenge) throw new Error('UserChallenge not found');
  userChallenge.status = 'completed';
  userChallenge.completedAt = new Date();
  userChallenge.rewardReceived = true;
  await userChallenge.save();
  // Thưởng: Cập nhật decorations cho piggy
  const piggy = await PiggyBank.findOne({ where: { userId } });
  if (piggy) {
    const challenge = await Challenge.findByPk(userChallenge.challengeId);
    piggy.decorations = piggy.decorations ? piggy.decorations + ', ' + `Reward from challenge ${challenge.challengeId}` : `Reward from challenge ${challenge.challengeId}`;
    await piggy.save();
  }
  return userChallenge;
};

const getUserChallenges = async (userId) => {
  return await UserChallenge.findAll({ where: { userId }, include: [{ model: Challenge }] });
};

module.exports = { getRandomChallenge, startChallenge, completeChallenge, getUserChallenges };