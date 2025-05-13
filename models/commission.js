'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Commission extends Model {
    static associate(models) {
      // 佣金关联订单
      Commission.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // 佣金关联用户
      Commission.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Commission.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '佣金金额，单位元'
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '佣金明细'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    modelName: 'Commission',
    tableName: 'commission',
    underscored: false, // 因为字段使用了 createdAt 而不是 created_at
    timestamps: true
  });

  return Commission;
};
