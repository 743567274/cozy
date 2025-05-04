// migrations/[timestamp]-create-withdrawal-record.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('withdrawal_record', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
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
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '提现金额（单位：分）',
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '提现状态: 0-待审核, 1-已通过, 2-已拒绝',
      },
      reason: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '拒绝原因',
      },
      create_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '创建时间',
      },
      update_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        comment: '更新时间',
      },
    });

    // 添加索引
    await queryInterface.addIndex('withdrawal_record', ['user_id']);
    await queryInterface.addIndex('withdrawal_record', ['status']);
    await queryInterface.addIndex('withdrawal_record', ['create_time']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('withdrawal_record');
  }
};