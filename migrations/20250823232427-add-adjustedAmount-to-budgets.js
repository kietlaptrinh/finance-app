'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Thêm cột adjustedAmount vào bảng 'budgets'
    await queryInterface.addColumn('budgets', 'adjustedAmount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Số tiền sau khi áp dụng quy tắc tự động'
    });
  },

  async down (queryInterface, Sequelize) {
    // Xóa cột adjustedAmount khỏi bảng 'budgets'
    await queryInterface.removeColumn('budgets', 'adjustedAmount');
  }
};