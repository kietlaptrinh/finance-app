'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Transaction, { foreignKey: 'userId' });
      User.hasMany(models.Category, { foreignKey: 'userId' });
      User.hasMany(models.Budget, { foreignKey: 'userId' });
      User.hasMany(models.SavingGoal, { foreignKey: 'userId' });
      User.hasOne(models.PiggyBank, { foreignKey: 'userId' });
      User.hasMany(models.UserChallenge, { foreignKey: 'userId' });
      User.hasMany(models.CurrencyConversion, { foreignKey: 'userId' });
      User.hasOne(models.UserSetting, { foreignKey: 'userId' });
      User.hasMany(models.AuditLog, { foreignKey: 'userId' });
    }
  }
  User.init({
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'user_id'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash'
    },
    fullName: {
      type: DataTypes.STRING,
      field: 'full_name'
    },
    profilePictureUrl: {
      type: DataTypes.STRING,
      field: 'profile_picture_url'
    },
    resetToken: {
      type: DataTypes.STRING,
      field: 'reset_token'
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      field: 'reset_token_expiry'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      }
    }
  });

  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
  };

  return User;
};