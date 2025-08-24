'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PiggyBank extends Model {
    static associate(models) {
      PiggyBank.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  PiggyBank.init({
    piggyId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'piggy_id'
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true, field: 'user_id' },
    status: { type: DataTypes.ENUM('happy', 'sad', 'neutral'), defaultValue: 'neutral' },
    savedAmount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    decorations: DataTypes.TEXT,
    lastInteraction: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'PiggyBank',
    tableName: 'piggy_bank',
    timestamps: false
  });
  return PiggyBank;
};