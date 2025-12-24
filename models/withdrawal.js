'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Withdrawal extends Model {
    static associate(models) {
      // 提现关联用户
      Withdrawal.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Withdrawal.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '提现金额,单位为分'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '提现状态: 0-待审核, 1-已通过, 2-已拒绝'
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '拒绝原因'
    },
    account_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '账户名'
    },
    account_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '账户号'
    }
  }, {
    sequelize,
    modelName: 'Withdrawal',
    tableName: 'withdrawals',
    timestamps: true // 因为使用了 create_time / update_time 而不是 createdAt / updatedAt
  });

  return Withdrawal;
};
