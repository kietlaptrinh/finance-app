'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSetting extends Model {
    static associate(models) {
      UserSetting.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  UserSetting.init({
    settingId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'setting_id'
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true, field: 'user_id' },
    moodBasedTheme: { type: DataTypes.BOOLEAN, defaultValue: false },
    currentMood: { type: DataTypes.ENUM('happy', 'sad', 'productive', 'relaxed'), defaultValue: 'productive' },
    calendarSyncUrl: { type: DataTypes.STRING, allowNull: true },
    googleCalendarToken: { type: DataTypes.JSON, allowNull: true }, 
    autoRules: DataTypes.TEXT,
    dataSyncEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    preferredCurrency: { type: DataTypes.STRING(3), defaultValue: 'VND' },
    points: { type: DataTypes.INTEGER, defaultValue: 0 }, 
    badges: { type: DataTypes.JSON, defaultValue: [] }
  }, {
    sequelize,
    modelName: 'UserSetting',
    tableName: 'user_settings',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return UserSetting;
};