'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsTo(models.User, { foreignKey: 'userId' });
      Category.hasMany(models.Transaction, { foreignKey: 'categoryId' });
      Category.hasMany(models.Budget, { foreignKey: 'categoryId' });
    }
  }
  Category.init({
    categoryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'category_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_default'
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    createdAt: 'created_at',
    updatedAt: false
  });
  return Category;
};