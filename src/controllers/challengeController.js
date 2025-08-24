// backend/src/controllers/challengeController.js
const challengeService = require('../services/challengeService');

const getRandomChallenge = async (req, res) => {
  try {
    const challenge = await challengeService.getRandomChallenge();
    res.json(challenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const startChallenge = async (req, res) => {
  try {
    const { challengeId } = req.body;
    const userChallenge = await challengeService.startChallenge(req.user.userId, challengeId);
    res.status(201).json(userChallenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const completeChallenge = async (req, res) => {
  try {
    const { userChallengeId } = req.params;
    const userChallenge = await challengeService.completeChallenge(req.user.userId, userChallengeId);
    res.json(userChallenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const getUserChallenges = async (req, res) => {
  try {
    const challenges = await challengeService.getUserChallenges(req.user.userId); // Giả sử thêm method trong service
    res.json(challenges);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getRandomChallenge, startChallenge, completeChallenge, getUserChallenges };