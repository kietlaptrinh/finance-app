'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BudgetRule extends Model {
    static associate(models) {
      BudgetRule.belongsTo(models.User, { foreignKey: 'userId' });
      BudgetRule.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }
  BudgetRule.init({
    ruleId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'rule_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id'
    },
    eventType: {
      type: DataTypes.ENUM('exam_week', 'summer_break', 'custom'),
      allowNull: false
    },
    adjustmentType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false
    },
    adjustmentValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'BudgetRule',
    tableName: 'budget_rules',
    timestamps: false
  });
  return BudgetRule;
};