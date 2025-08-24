const { SavingGoal, PiggyBank, sequelize } = require('../models');

const createSavingGoal = async (userId, data) => {
  const { name, targetAmount, startDate, endDate } = data;
  return await SavingGoal.create({ userId, name, targetAmount, currentAmount: 0, startDate, endDate });
};

const updateSavingGoal = async (userId, goalId, data) => {
  const goal = await SavingGoal.findOne({ where: { goalId, userId } });
  if (!goal) throw new Error('Goal not found');
  if (data.addAmount) {
    data.currentAmount = goal.currentAmount + data.addAmount;
    delete data.addAmount;
  }
  await goal.update(data);
  return goal;
};

const getSavingGoals = async (userId) => {
  return await SavingGoal.findAll({ where: { userId } });
};

const deleteSavingGoal = async (userId, goalId) => {
  const goal = await SavingGoal.findOne({ where: { goalId, userId } });
  if (!goal) throw new Error('Goal not found');
  await goal.destroy();
};

const depositToGoal = async (userId, goalId, amount) => {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
        throw new Error('Số tiền nạp không hợp lệ.');
    }

    // Sử dụng transaction để đảm bảo cả 2 thao tác cùng thành công hoặc thất bại
    const t = await sequelize.transaction();

    try {
        // 1. Lấy heo đất chính và mục tiêu tiết kiệm
        const piggyBank = await PiggyBank.findOne({ where: { userId }, transaction: t });
        const savingGoal = await SavingGoal.findOne({ where: { goalId, userId }, transaction: t });

        if (!piggyBank) throw new Error('Không tìm thấy heo đất chính.');
        if (!savingGoal) throw new Error('Không tìm thấy mục tiêu tiết kiệm.');
        if (parseFloat(piggyBank.savedAmount) < amount) {
            throw new Error('Số tiền trong heo đất chính không đủ.');
        }

        // 2. Thực hiện chuyển tiền
        const newPiggyBankAmount = parseFloat(piggyBank.savedAmount) - amount;
        const newGoalAmount = parseFloat(savingGoal.currentAmount) + amount;

        await piggyBank.update({ savedAmount: newPiggyBankAmount }, { transaction: t });
        await savingGoal.update({ currentAmount: newGoalAmount }, { transaction: t });

        // Nếu mọi thứ thành công, commit transaction
        await t.commit();

        return savingGoal;

    } catch (error) {
        // Nếu có lỗi, rollback tất cả thay đổi
        await t.rollback();
        throw error; // Ném lỗi ra để controller xử lý
    }
};

module.exports = { createSavingGoal, updateSavingGoal, getSavingGoals, deleteSavingGoal , depositToGoal,};