// backend/src/controllers/currencyController.js
const currencyService = require('../services/currencyService');

const convert = async (req, res) => {
  try {
    const { from, to, amount } = req.body;
    const result = await currencyService.convertCurrency(req.user.userId, from, to, amount);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getHistorical = async (req, res) => {
    try {
        // <<< THAY ĐỔI: Chỉ nhận 'date', không nhận 'startDate', 'endDate'
        const { from, to, date } = req.query; 
        const rate = await currencyService.getHistoricalRates(from, to, date);
        res.json({ rate });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getConversionsHistory = async (req, res) => {
  try {
    const history = await currencyService.getConversionsHistory(req.user.userId); // Giả sử thêm method trong service
    res.json(history);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { convert, getHistorical, getConversionsHistory };