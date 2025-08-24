'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Challenge extends Model {
    static associate(models) {
      Challenge.hasMany(models.UserChallenge, { foreignKey: 'challengeId' });
    }
  }
  Challenge.init({
    challengeId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'challenge_id'
    },
    description: { type: DataTypes.TEXT, allowNull: false },
    rewardPoints: { type: DataTypes.INTEGER, allowNull: false },
    durationDays: { type: DataTypes.INTEGER, allowNull: false },
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Challenge',
    tableName: 'challenges',
    createdAt: 'created_at',
    updatedAt: false
  });
  return Challenge;
};