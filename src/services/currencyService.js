const axios = require('axios');
const { CurrencyConversion } = require('../models');
require('dotenv').config();

const convertCurrency = async (userId, from, to, amount) => {
  const apiKey = process.env.CURRENCY_API_KEY;
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;
  const response = await axios.get(url);
  if (response.data.result !== 'success') throw new Error('Conversion failed');
  const result = response.data.conversion_result;
  await CurrencyConversion.create({ userId, fromCurrency: from, toCurrency: to, amount, result });
  return { from, to, amount, result };
};
// backend/src/services/currencyService.js

const getHistoricalRates = async (from, to, date) => {
    // <<< THAY ĐỔI: Xây dựng URL cho một ngày duy nhất
    const url = `https://api.frankfurter.app/${date}?from=${from}&to=${to}`;
    const response = await axios.get(url);

    const rateValue = response.data.rates ? response.data.rates[to] : null;

    if (rateValue === undefined || rateValue === null) {
        // Trả về null thay vì ném lỗi để frontend có thể bỏ qua
        return null;
    }
    return rateValue;
};

const getConversionsHistory = async (userId) => {
  return await CurrencyConversion.findAll({ where: { userId }, order: [['conversionDate', 'DESC']] });
};

module.exports = { convertCurrency, getHistoricalRates, getConversionsHistory };