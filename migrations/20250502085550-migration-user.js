// migrations/[timestamp]-create-user.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT, // 使用 BIGINT 存储雪花ID
        primaryKey: true,
        autoIncrement: false,
      },
      username: {
        type: Sequelize.STRING(80),
        unique: true,
        allowNull: true,
        comment: '用户名'
      },
      password: {
        type: Sequelize.STRING(80),
        allowNull: true,
        comment: '密码'
      },
      openid: {
        type: Sequelize.STRING(80),
        unique: true,
        allowNull: false,
        comment: '微信用户openid标识'
      },
      balance: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: '余额，单位为分'
      },
      name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '昵称'
      },
      avatar: {
        type: Sequelize.STRING(120),
        allowNull: false,
        comment: '头像'
      },
      superiorId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        comment: '上级id',
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      invited_several: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '邀请人数'
      },
      visit_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '访问次数'
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '最后登录时间'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '创建时间'
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '更新时间'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user');
  }
};