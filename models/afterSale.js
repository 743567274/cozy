'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AfterSale extends Model {
    static associate(models) {
      // 售后记录关联订单
      AfterSale.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // 售后记录关联用户
      AfterSale.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  AfterSale.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('refund', 'exchange', 'resend', 'only_refund'),
      allowNull: false,
      comment: '售后类型',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '用户填写的申请原因',
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '用户上传的图片凭证',
    },
    status: {
      type: DataTypes.ENUM(
        'pending', // 待处理
        'rejected', // 拒绝
        'approved', // 通过
        'returning', // 退货中
        'received', // 已收到
        'refunded', // 已退款
        'exchanged', // 已换货
        'resent', // 已补发
        'completed' // 已完成
      ),
      defaultValue: 'pending',
    },
    logisticsName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '物流公司名称',
    },
    logisticsNo: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '物流单号',
    },
    resendLogisticsName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '重新发货物流公司名称',
    },
    resendLogisticsNo: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '重新发货物流单号',
    },
    refundAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '退款金额'
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: true,
       comment: '回复内容'
    }
  }, {
    sequelize,
    modelName: 'AfterSale',
    tableName: 'afterSales',
    underscored: true,
    timestamps: true // 因为你手动用了 created_at 和 updated_at
  });

  return AfterSale;
};
