const { Transaction, Category, AuditLog } = require('../models');
const { Op } = require('sequelize');

const addTransaction = async (userId, data) => {
  const { categoryId, amount, transactionDate, note, type, receiptImageUrl } = data;
  const category = await Category.findOne({
    where: { categoryId, [Op.or]: [{ userId }, { isDefault: true }] }
  });
  if (!category) throw new Error('Invalid category');
  const transaction = await Transaction.create({ userId, categoryId, amount, transactionDate, note, type, receiptImageUrl });
  await AuditLog.create({ userId, actionType: 'add_transaction', details: JSON.stringify(data) });
  return transaction;
};

const updateTransaction = async (userId, transactionId, data) => {
  const transaction = await Transaction.findOne({ where: { transactionId, userId } });
  if (!transaction) throw new Error('Transaction not found');
  await transaction.update(data);
  await AuditLog.create({ userId, actionType: 'update_transaction', details: JSON.stringify(data) });
  return transaction;
};

const deleteTransaction = async (userId, transactionId) => {
  const transaction = await Transaction.findOne({ where: { transactionId, userId } });
  if (!transaction) throw new Error('Transaction not found');
  await transaction.destroy();
  await AuditLog.create({ userId, actionType: 'delete_transaction', details: transactionId });
};

const getTransactions = async (userId, filters) => {
       const where = { userId };
       if (filters.type) where.type = filters.type;
       if (filters.categoryId) where.categoryId = filters.categoryId;
       if (filters.startDate && filters.endDate) {
         where.transactionDate = { [Op.between]: [filters.startDate, filters.endDate] };
       }
       if (filters.note) {
         where.note = { [Op.iLike]: `%${filters.note}%` };
       }

       const page = parseInt(filters.page) || 1;
       const pageSize = parseInt(filters.pageSize) || 10;
       const offset = (page - 1) * pageSize;

       const { count, rows } = await Transaction.findAndCountAll({
         where,
         include: [{ model: Category }],
         order: [['transactionDate', 'DESC']],
         limit: pageSize,
         offset,
       });

       return {
         transactions: rows,
         total: count,
       };
     };

module.exports = { addTransaction, updateTransaction, deleteTransaction, getTransactions };