'use strict';

const { Model, DataTypes } = require('sequelize');
const SnowflakeID = require('snowflake-id').default;

// 统一的 Snowflake 实例
const snowflake = new SnowflakeID({ mid: 1 });

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Order 属于 User
      Order.belongsTo(models.User, {
        foreignKey: {
          name: 'user_id',
          allowNull: false
        },
        as: 'user',
        targetKey: 'id'
      });

      // Order 属于 Address
      Order.belongsTo(models.Address, {
        foreignKey: {
          name: 'shipping_address',
          allowNull: false
        },
        as: 'address',
        targetKey: 'id'
      });
      // Order -> OrderProduct
      Order.hasMany(models.OrderProduct, {
        foreignKey: {
          name: 'order_id',
          allowNull: false
        },
        as: 'orderProducts'
      });
    }
  }

  Order.init({
    id: {
      type: DataTypes.STRING(19),
      primaryKey: true,
      allowNull: true,
      comment: '订单ID'
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '订单类型，1为定制订单，2为普通订单'
    },
    user_id: {
      type: DataTypes.STRING(19),
      allowNull: false,
      comment: '用户ID'
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '订单总价'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '订单状态：0未支付,1待发货,2待收货,3已完成,4已取消,5已退款,6售后中,7售后完成'
    },
    pay_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '支付时间'
    },
    shipping_address: {
      type: DataTypes.STRING(19),
      allowNull: true,
      comment: '收货地址ID'
    },
    express_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '快递公司名称'
    },
    express_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '快递单号'
    },
    closing_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '订单完结时间'
    },
    delivery_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '发货时间'
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '订单说明'
    },
    remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '管理员备注'
    },
    customized_data: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '如果是定制订单，那么这是定制数据'
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,      // 自动生成 created_at 和 updated_at
    underscored: true, // 使用下划线
    indexes: [
      { fields: ['user_id'] },
      { fields: ['status'] },
      { fields: ['shipping_address'] }
    ]
  });

  // 创建前生成 ID
  Order.beforeCreate((order) => {
    order.id = snowflake.generate().toString();
  });

  return Order;
};