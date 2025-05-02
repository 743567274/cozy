// migrations/[timestamp]-create-after-sales.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('after_sales', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '用户id',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '订单id',
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      remarks: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '备注',
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '状态: 0-申请中, 1-处理中, 2-已完成, 3-已拒绝',
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '售后拍照图片',
      },
      refundAmount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '退款金额(分)',
        field: 'refund_amount' // 映射到数据库的 refund_amount 列
      },
      refundTime: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '退款时间',
        field: 'refund_time' // 映射到数据库的 refund_time 列
      },
      tracking_number: {
        type: Sequelize.STRING(80),
        allowNull: true,
        comment: '用户退货物流单号',
      },
      reject_reason: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '拒绝原因',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '创建时间',
        field: 'created_at' // 映射到数据库的 created_at 列
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        comment: '更新时间',
        field: 'updated_at' // 映射到数据库的 updated_at 列
      },
    });

    // 添加索引
    await queryInterface.addIndex('after_sales', ['userId']);
    await queryInterface.addIndex('after_sales', ['orderId']);
    await queryInterface.addIndex('after_sales', ['status']);
    await queryInterface.addIndex('after_sales', ['refundAmount']);
    await queryInterface.addIndex('after_sales', ['tracking_number']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('after_sales');
  }
};