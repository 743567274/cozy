'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // 提现申请表
    await queryInterface.createTable('withdrawals', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '用户id'
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '提现金额,单位为分'
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '提现状态: 0-待审核, 1-已通过, 2-已拒绝'
      },
      reason: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '拒绝原因'
      },
      account_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '账户名'
      },
      account_number: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '账户号'
      },
      createAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '创建时间'
      },
      updateAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '更新时间'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
