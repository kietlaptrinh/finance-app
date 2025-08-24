'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CurrencyConversion extends Model {
    static associate(models) {
      CurrencyConversion.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  CurrencyConversion.init({
    conversionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'conversion_id'
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    fromCurrency: { type: DataTypes.STRING(3), allowNull: false },
    toCurrency: { type: DataTypes.STRING(3), allowNull: false },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    result: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    conversionDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'CurrencyConversion',
    tableName: 'currency_conversions',
    timestamps: false
  });
  return CurrencyConversion;
};