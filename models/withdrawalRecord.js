// models/withdrawalRecord.js
// 提现记录模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WithdrawalRecord = sequelize.define('WithdrawalRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户id',
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '提现金额',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '提现状态: 0-待审核, 1-已通过, 2-已拒绝',
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '拒绝原因',
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间',
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
      comment: '更新时间',
    },
  }, {
    tableName: 'withdrawal_record',
    underscored: true,
    timestamps: false,
  });

  return WithdrawalRecord;
};
