// migrations/[timestamp]-create-order.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.BIGINT, // 使用 BIGINT 存储雪花ID
        primaryKey: true
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        comment: '用户id',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      addressId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '收货地址id',
        references: {
          model: 'address',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      total_price: {
        type: Sequelize.BIGINT,
        allowNull: false,
        comment: '订单总金额，单位为分',
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '订单状态：0-未支付，1-取消支付，2-待发货，3-运输中，4-已完成，5-售后中',
      },
      payment_time: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '支付时间',
      },
      express_name: {
        type: Sequelize.STRING(80),
        allowNull: true,
        comment: '快递公司名称',
      },
      express_number: {
        type: Sequelize.STRING(80),
        allowNull: true,
        comment: '快递单号',
      },
      closing_time: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '完结时间',
      },
      delivery_time: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '发货时间',
      },
      remarks: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '备注',
      },
      is_after_sales: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '是否售后',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '创建时间',
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '更新时间',
        field: 'updated_at'
      },
    });
  }
};