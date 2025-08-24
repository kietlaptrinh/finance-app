'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Leaderboard extends Model {
    static associate(models) {
      Leaderboard.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Leaderboard.init({
    leaderboardId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'leaderboard_id'
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    }
  }, {
    sequelize,
    modelName: 'Leaderboard',
    tableName: 'leaderboards',
    timestamps: true,
    updatedAt: false
  });
  return Leaderboard;
};