const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/convert', currencyController.convert);
router.get('/historical', currencyController.getHistorical);
router.get('/history', currencyController.getConversionsHistory);

module.exports = router;