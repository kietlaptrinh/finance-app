const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/random', challengeController.getRandomChallenge);
router.post('/start', challengeController.startChallenge);
router.put('/complete/:userChallengeId', challengeController.completeChallenge);
router.get('/user', challengeController.getUserChallenges);

module.exports = router;