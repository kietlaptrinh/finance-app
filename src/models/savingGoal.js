'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SavingGoal extends Model {
    static associate(models) {
      SavingGoal.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  SavingGoal.init({
    goalId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'goal_id'
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    targetAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    currentAmount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY },
    progressPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      field: 'progress_percentage',
      get() {
        const target = this.getDataValue('targetAmount');
        const current = this.getDataValue('currentAmount');
        return target ? (current / target) * 100 : 0;
      }
    }
  }, {
    sequelize,
    modelName: 'SavingGoal',
    tableName: 'saving_goals',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return SavingGoal;
};