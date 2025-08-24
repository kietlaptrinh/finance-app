'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    static associate(models) {
      Budget.belongsTo(models.User, { foreignKey: 'userId' });
      Budget.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }
  Budget.init({
    budgetId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'budget_id'
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    categoryId: { type: DataTypes.INTEGER, allowNull: false, field: 'category_id' },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    adjustedAmount: { 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Số tiền sau khi áp dụng quy tắc tự động'
    },
    period: { type: DataTypes.ENUM('monthly', 'weekly', 'yearly'), defaultValue: 'monthly' },
    startDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'start_date' },
    endDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'end_date' }
  }, {
    sequelize,
    modelName: 'Budget',
    tableName: 'budgets',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Budget;
};