const cron = require('node-cron');
const { User, Budget, BudgetRule } = require('../models');
const { fetchCalendarEvents } = require('../controllers/settingController');

cron.schedule('0 0 * * *', async () => {
  console.log('Chạy job điều chỉnh ngân sách...');
  const users = await User.findAll();
  for (const user of users) {
    const events = await fetchCalendarEvents({ user: { userId: user.userId } });
    const rules = await BudgetRule.findAll({ where: { userId: user.userId } });
    for (const rule of rules) {
      const matchingEvents = events.filter((event) => {
        if (rule.eventType === 'exam_week' && event.summary?.toLowerCase().includes('exam')) return true;
        if (rule.eventType === 'summer_break' && event.summary?.toLowerCase().includes('summer')) return true;
        if (rule.eventType === 'custom') {
          const eventDate = new Date(event.start);
          return eventDate >= new Date(rule.startDate) && eventDate <= new Date(rule.endDate);
        }
        return false;
      });
      if (matchingEvents.length > 0) {
        const budget = await Budget.findOne({ where: { userId: user.userId, categoryId: rule.categoryId } });
        if (budget) {
          let newAmount = parseFloat(budget.amount);
          if (rule.adjustmentType === 'percentage') {
            newAmount *= (1 + parseFloat(rule.adjustmentValue) / 100);
          } else {
            newAmount += parseFloat(rule.adjustmentValue);
          }
          await budget.update({ amount: newAmount });
          console.log(`Ngân sách ${budget.budgetId} đã được điều chỉnh: ${newAmount} VND`);
        }
      }
    }
  }
});