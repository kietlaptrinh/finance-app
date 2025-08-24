const { PiggyBank, AuditLog, Category, Transaction } = require('../models');

const getPiggyBank = async (userId) => {
  let piggy = await PiggyBank.findOne({ where: { userId } });
  if (!piggy) {
    piggy = await PiggyBank.create({ userId, status: 'neutral', savedAmount: 0 });
  }
  return piggy;
};

const depositToPiggy = async (userId, amount) => {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    throw new Error(`Invalid amount: ${amount}. Amount must be a positive number`);
  }
  
  const piggy = await getPiggyBank(userId);
  // Ép kiểu savedAmount thành số, mặc định là 0 nếu không hợp lệ
  const currentAmount = parseFloat(piggy.savedAmount) || 0;
  const newAmount = currentAmount + amount;
  piggy.savedAmount = parseFloat(newAmount.toFixed(2));
  piggy.status = piggy.savedAmount > 0 ? 'happy' : piggy.savedAmount === 0 ? 'neutral' : 'sad';
  piggy.lastInteraction = new Date();
  
  // Tìm danh mục "Piggy Bank Deposit" hoặc tạo mới nếu chưa có
  let category = await Category.findOne({ 
    where: { userId, name: 'Piggy Bank Deposit', type: 'expense' } 
  });
  if (!category) {
    category = await Category.create({
      userId,
      name: 'Piggy Bank Deposit',
      type: 'expense',
      isDefault: false
    });
  }

  // Tạo giao dịch chi tiêu để trừ số dư
  await Transaction.create({
    userId,
    categoryId: category.categoryId,
    amount: parseFloat(amount.toFixed(2)),
    transactionDate: new Date(),
    note: `Deposit to Piggy Bank`,
    type: 'expense'
  });

  console.log('Saving piggy with savedAmount:', piggy.savedAmount, 'type:', typeof piggy.savedAmount);
  await piggy.save();
  await AuditLog.create({ 
    userId, 
    actionType: 'deposit_piggy', 
    details: `Deposited ${amount} to Piggy Bank` 
  });
  return piggy;
};


const updateDecorations = async (userId, decorations) => {
  const piggy = await getPiggyBank(userId);
  piggy.decorations = decorations;
  await piggy.save();
  return piggy;
};

module.exports = { getPiggyBank, depositToPiggy, updateDecorations };