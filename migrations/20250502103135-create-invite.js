// migrations/[timestamp]-create-invite.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invite', {
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
      inviteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '邀请人id',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      inviteTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '邀请时间',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '创建时间',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        comment: '更新时间',
      },
    });

    // 添加复合索引和单字段索引
    await queryInterface.addIndex('invite', ['userId', 'inviteId'], {
      unique: true,
      name: 'invite_user_inviter_unique'
    });
    await queryInterface.addIndex('invite', ['userId']);
    await queryInterface.addIndex('invite', ['inviteId']);
    await queryInterface.addIndex('invite', ['inviteTime']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('invite');
  }
};