'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {
      AuditLog.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  AuditLog.init({
    logId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'log_id'
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    actionType: { type: DataTypes.STRING, allowNull: false },
    details: DataTypes.TEXT,
    logDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'AuditLog',
    tableName: 'audit_logs',
    timestamps: false
  });
  return AuditLog;
};