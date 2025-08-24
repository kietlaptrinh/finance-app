'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('leaderboards', {
      leaderboardId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'leaderboard_id'
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
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
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('leaderboards');
  }
};