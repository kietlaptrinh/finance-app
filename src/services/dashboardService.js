const { Transaction, Budget, SavingGoal, BudgetRule, Category } = require('../models');
const { Op } = require('sequelize');

const getDashboardSummary = async (userId, month, year) => {
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59); // Thêm giờ để bao trọn ngày cuối tháng

    // Lấy tất cả dữ liệu cần thiết trong một vài lần gọi
    const transactions = await Transaction.findAll({
        where: { userId, transactionDate: { [Op.between]: [startDate, endDate] } },
        include: [{ model: Category, attributes: ['categoryId', 'name'] }],
    });
    
    const budgets = await Budget.findAll({ where: { userId } });
    const goals = await SavingGoal.findAll({ where: { userId } });
    
    // <<< LOGIC ĐIỀU CHỈNH NGÂN SÁCH TỪ ACADEMIC SYNC >>>
    // Không cần gọi lại BudgetRule ở đây vì cron job đã cập nhật `adjustedAmount` trong `budgets`
    
    // Tính toán thu/chi/số dư
    const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const expense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const balance = income - expense;
    const isNegativeBalance = balance < 0;

    // Tính chi tiêu theo danh mục
    const categoryExpenses = {};
    transactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
            categoryExpenses[t.categoryId] = (categoryExpenses[t.categoryId] || 0) + parseFloat(t.amount || 0);
        });

    // Tính tiến độ ngân sách (đọc adjustedAmount)
    const budgetProgress = budgets.map((b) => {


      if (b.period === 'points_harvest') {
            // Đối với ngân sách thu thập, "spent" không có ý nghĩa,
            // "amount" chính là tổng số tiền đã thu thập được.
            return {
                budgetId: b.budgetId,
                categoryName: b.Category?.name || 'Thu thập Điểm thưởng',
                isHarvestBudget: true, // Thêm một cờ để frontend nhận biết
                harvestedAmount: parseFloat(b.amount),
            };
        }
        const spent = transactions
            .filter((t) => t.type === 'expense' && t.categoryId === b.categoryId)
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

        const isAdjusted = b.adjustedAmount !== null && b.adjustedAmount !== undefined;
        const budgetLimit = isAdjusted ? parseFloat(b.adjustedAmount) : parseFloat(b.amount);
        
        return {
            budgetId: b.budgetId,
            categoryName: b.Category?.name, // Lấy tên category nếu có include
            isHarvestBudget: false,
            amount: parseFloat(b.amount),
            adjustedAmount: isAdjusted ? parseFloat(b.adjustedAmount) : null,
            spent,
            progressPercentage: budgetLimit > 0 ? (spent / budgetLimit) * 100 : 0,
        };
    });

    // Tính tiến độ mục tiêu tiết kiệm
    const goalProgress = goals.map((goal) => ({
        goalId: goal.goalId,
        name: goal.name,
        targetAmount: parseFloat(goal.targetAmount),
        currentAmount: parseFloat(goal.currentAmount),
        progressPercentage: parseFloat(goal.targetAmount) > 0 ? (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100 : 0,
    }));

    return {
        income,
        expense,
        balance,
        isNegativeBalance,
        categoryExpenses,
        budgetProgress,
        goals: goalProgress,
    };
};

module.exports = { getDashboardSummary };