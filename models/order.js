'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Order 属于 User
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // Order 的地址（注意：这里可能需要确认 address 字段是 id 还是字符串，按你的 migration 写法是 address.id）
      Order.belongsTo(models.Address, {
        foreignKey: 'shipping_address',
        as: 'address'
      });
    }
  }

  Order.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户id'
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '订单总价,单位为分'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '订单状态，0为未支付，1为已支付，2为待发货，3为已发货，4为已完成，5为已取消，6为已退款，7为售后中，8为售后完成'
    },
    pay_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '支付时间'
    },
    shipping_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '收货地址'
    },
    express_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '快递名称'
    },
    express_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '快递单号'
    },
    closing_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '完结时间'
    },
    delivery_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '发货时间'
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '订单说明，由用户填写'
    },
    remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '备注'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: '创建时间'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: '更新时间'
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: false,
    underscored: true
  });

  return Order;
};
