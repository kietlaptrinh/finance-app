// backend/src/services/academicSyncService.js
const cron = require('node-cron');
const { User, UserSetting, BudgetRule, Budget } = require('../models');
const ical = require('node-ical');
const { Op } = require('sequelize');

// Hàm lấy sự kiện từ URL iCal
const getEventsFromICal = async (url) => {
    try {
        const events = await ical.async.fromURL(url);
        return Object.values(events).map(event => ({
            summary: event.summary,
            start: new Date(event.start),
            end: new Date(event.end),
        }));
    } catch (error) {
        console.error(`Error fetching iCal from ${url}:`, error);
        return [];
    }
};

// Hàm chính để xử lý đồng bộ
const processAcademicSync = async () => {
    console.log('Running Academic Sync Job at:', new Date());
    const usersWithSync = await User.findAll({
        include: [{
            model: UserSetting,
            where: { calendarSyncUrl: { [Op.ne]: null, [Op.ne]: '' } },
            required: true
        }, {
            model: BudgetRule,
            required: true
        }]
    });
    await Budget.update({ adjustedAmount: null }, { where: {} });

    for (const user of usersWithSync) {
        const events = await getEventsFromICal(user.UserSetting.calendarSyncUrl);
        const today = new Date();

        for (const rule of user.BudgetRules) {
            let isEventActive = false;
            // Kiểm tra các sự kiện trong lịch
            for (const event of events) {
                if (today >= event.start && today <= event.end) {
                    const summary = event.summary.toLowerCase();
                    if (rule.eventType === 'exam_week' && summary.includes('thi')) {
                        isEventActive = true;
                        break;
                    }
                    if (rule.eventType === 'summer_break' && (summary.includes('hè') || summary.includes('summer'))) {
                        isEventActive = true;
                        break;
                    }
                }
            }
            
            // Kiểm tra quy tắc tùy chỉnh
            if (rule.eventType === 'custom' && today >= new Date(rule.startDate) && today <= new Date(rule.endDate)) {
                isEventActive = true;
            }

            if (isEventActive) {
                console.log(`Rule ${rule.ruleId} is active for user ${user.userId}`);
                
                // <<< LOGIC ĐIỀU CHỈNH NGÂN SÁCH >>>
                const targetBudget = await Budget.findOne({
                    where: {
                        userId: user.userId,
                        categoryId: rule.categoryId,
                        // Có thể thêm điều kiện kiểm tra budget còn hiệu lực
                    }
                });

                if (targetBudget) {
                    let newAdjustedAmount = parseFloat(targetBudget.amount);
                    const adjustmentValue = parseFloat(rule.adjustmentValue);

                    if (rule.adjustmentType === 'percentage') {
                        newAdjustedAmount *= (1 + (adjustmentValue / 100));
                    } else { // fixed_amount
                        newAdjustedAmount += adjustmentValue;
                    }
                    
                    // Cập nhật adjustedAmount, đảm bảo không âm
                    await targetBudget.update({
                        adjustedAmount: Math.max(0, newAdjustedAmount)
                    });
                    console.log(`Budget ${targetBudget.budgetId} for user ${user.userId} adjusted to ${newAdjustedAmount}`);
                }
            }
        }
    }
};

const start = () => {
    cron.schedule('0 1 * * *', processAcademicSync); // Chạy mỗi ngày lúc 1 giờ sáng
    console.log('Academic Sync Service scheduled to run daily at 1 AM.');
};

module.exports = { start };