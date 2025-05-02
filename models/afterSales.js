// models/afterSales.js
// 售后记录
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AfterSales = sequelize.define('AfterSales', {
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
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '订单id',
    },
    remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '备注',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '状态: 0-申请中, 1-处理中, 2-已完成, 3-已拒绝',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '售后拍照图片',
    },
    refundAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '退款金额(分)',
    },
    refundTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '退款时间',
    },
    tracking_number: {
      type: DataTypes.STRING(80),
      allowNull: true,
      comment: '用户退货物流单号',
    },
    reject_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '拒绝原因',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间',
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '更新时间',
    },
  }, {
    tableName: 'after_sales',
    timestamps: true
  });

  AfterSales.associate = (models) => {
    // 所属用户
    AfterSales.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    // 所属订单
    AfterSales.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
    });
  };

  return AfterSales;
};
