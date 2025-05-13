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
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('refund', 'exchange', 'resend', 'only_refund'),
      allowNull: false,
      comment: '售后类型',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'rejected',
        'approved',
        'returning',
        'received',
        'refunded',
        'exchanged',
        'resent',
        'completed'
      ),
      defaultValue: 'pending',
    },
    logisticsName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logisticsNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resendLogisticsName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resendLogisticsNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refundAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    }
  }, {
    sequelize,
    modelName: 'AfterSale',
    tableName: 'afterSales',
    underscored: true,
    timestamps: false // 因为你手动用了 created_at 和 updated_at
  });

  return AfterSale;
};
