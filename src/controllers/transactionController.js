const transactionService = require('../services/transactionService');

const addTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.addTransaction(req.user.userId, req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.updateTransaction(req.user.userId, req.params.id, req.body);
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await transactionService.deleteTransaction(req.user.userId, req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactions(req.user.userId, req.query);
    res.json(transactions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { addTransaction, updateTransaction, deleteTransaction, getTransactions };