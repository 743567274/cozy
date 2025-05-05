// migrations/[timestamp]-create-commission.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('commission', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      orderId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        comment: '订单id',
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      commission: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '佣金金额，单位为分',
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '状态: 0-未结算, 1-已结算, 2-已取消',
      },
      remarks: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '备注:资金去向',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '创建时间',
        field: 'created_at' // 映射到数据库的 created_at 列
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '更新时间',
        field: 'updated_at' // 映射到数据库的 updated_at 列
      },
    });
  }
};