'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserChallenge extends Model {
    static associate(models) {
      UserChallenge.belongsTo(models.User, { foreignKey: 'userId' });
      UserChallenge.belongsTo(models.Challenge, { foreignKey: 'challengeId' });
    }
  }
  UserChallenge.init({
    userChallengeId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'user_challenge_id'
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    challengeId: { type: DataTypes.INTEGER, allowNull: false, field: 'challenge_id' },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: DataTypes.DATEONLY,
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), defaultValue: 'pending' },
    completedAt: DataTypes.DATE,
    rewardReceived: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    modelName: 'UserChallenge',
    tableName: 'user_challenges',
    timestamps: false
  });
  return UserChallenge;
};