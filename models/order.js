// models/order.js
// 订单模型
const { DataTypes } = require('sequelize');
const Snowflake = require('snowflake-id'); // 引入 Snowflake，雪花算法
const snowflake =  new Snowflake();

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: () => snowflake.generate()
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户id',
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '收货地址id',
    },
    total_price: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: '订单总金额，单位为分',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '订单状态：0-未支付，1-取消支付，2-待发货，3-运输中，4-已完成，5-售后中',
    },
    payment_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '支付时间',
    },
    express_name: {
      type: DataTypes.STRING(80),
      allowNull: true,
      comment: '快递公司名称',
    },
    express_number: {
      type: DataTypes.STRING(80),
      allowNull: true,
      comment: '快递单号',
    },
    closing_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '完结时间',
    },
    delivery_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '发货时间',
    },
    remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '备注',
    },
    is_after_sales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '是否售后',
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '更新时间',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间',
    },
  }, {
    tableName: 'order',
    timestamps: true,
  });

  Order.associate = (models) => {
    // 关联用户
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    // 关联收货地址
    Order.belongsTo(models.Address, {
      foreignKey: 'addressId',
      as: 'address',
    });

    // 一个订单有多个商品条目
    Order.hasMany(models.OrderGoods, {
      foreignKey: 'orderId',
      as: 'items',
      onDelete: 'CASCADE',
    });

    // 一个订单有多个分佣记录
    Order.hasMany(models.Commission, {
      foreignKey: 'orderId',
      as: 'commissions',
      onDelete: 'CASCADE',
    });

    // 一个订单有多个售后记录
    Order.hasMany(models.AfterSales, {
      foreignKey: 'orderId',
      as: 'after_sales',
      onDelete: 'CASCADE',
    });
  };

  return Order;
};
