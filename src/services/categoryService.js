const { Category } = require('../models');
const { Op } = require('sequelize');

const getCategoriesByUser = async (userId) => {
    // Lấy cả danh mục mặc định (không có userId) và danh mục của riêng người dùng
    return await Category.findAll({
        where: {
            [Op.or]: [{ userId: userId }, { isDefault: true }]
        },
        order: [['name', 'ASC']]
    });
};

const createCategory = async (userId, categoryData) => {
    const { name, type } = categoryData;
    if (!name || !type) throw new Error('Name and type are required.');

    return await Category.create({
        userId,
        name,
        type,
        isDefault: false // Danh mục do người dùng tạo không phải mặc định
    });
};

module.exports = {
    getCategoriesByUser,
    createCategory,
};