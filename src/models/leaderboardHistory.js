'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LeaderboardHistory extends Model {
    static associate(models) {
      LeaderboardHistory.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  LeaderboardHistory.init({
    historyId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'history_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    season: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rankScore: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    completedChallenges: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    speedScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    starRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    }
  }, {
    sequelize,
    modelName: 'LeaderboardHistory',
    tableName: 'leaderboard_history',
    timestamps: true,
    updatedAt: false
  });
  return LeaderboardHistory;
};