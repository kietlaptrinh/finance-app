const express = require('express');
const router = express.Router();
const piggyBankController = require('../controllers/piggyBankController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', piggyBankController.getPiggyBank);
router.post('/deposit', piggyBankController.depositToPiggy);
router.put('/decorations', piggyBankController.updateDecorations);

module.exports = router;