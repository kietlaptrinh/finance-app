module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('user_settings', 'points', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('user_settings', 'badges', {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('user_settings', 'points');
    await queryInterface.removeColumn('user_settings', 'badges');
  },
};