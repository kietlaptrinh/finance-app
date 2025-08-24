const { Transaction, Budget, SavingGoal, BudgetRule, Category } = require('../models');
const { Op } = require('sequelize');
const dashboardService = require('../services/dashboardService');

const getDashboardSummary = async (req, res) => {
    try {
        const { month, year } = req.query;
        const userId = req.user.userId;

        // Gọi service để lấy dữ liệu đã xử lý
        const summary = await dashboardService.getDashboardSummary(userId, month, year);
        
        // Trả về kết quả
        res.json(summary);
    } catch (err) {
        console.error('Error in getDashboardSummary controller:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getDashboardSummary };