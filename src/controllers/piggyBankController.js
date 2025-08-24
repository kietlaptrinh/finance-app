// backend/src/controllers/piggyBankController.js
const piggyBankService = require('../services/piggyBankService');

const getPiggyBank = async (req, res) => {
  try {
    const piggy = await piggyBankService.getPiggyBank(req.user.userId);
    res.json(piggy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const depositToPiggy = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log('Received deposit request with amount:', amount, 'type:', typeof amount);
    // Kiểm tra amount
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: `Invalid amount: ${amount}. Amount must be a positive number` });
    }
    const piggy = await piggyBankService.depositToPiggy(req.user.userId, parsedAmount);
    res.json(piggy);
  } catch (err) {
    console.error('Deposit error:', err.message);
    res.status(400).json({ message: err.message || 'Failed to deposit to Piggy Bank' });
  }
};

const updateDecorations = async (req, res) => {
  try {
    const { decorations } = req.body;
    const piggy = await piggyBankService.updateDecorations(req.user.userId, decorations);
    res.json(piggy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getPiggyBank, depositToPiggy, updateDecorations };