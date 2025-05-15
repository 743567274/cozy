'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // 用户表
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name:{
        type: Sequelize.STRING,
        allowNull: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        comment: '用户名'
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '密码'
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '头像'
      },
      superiorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '上级id',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      openid: {
        type: Sequelize.STRING(80),
        unique: true,
        allowNull: false,
        comment: '微信用户openid标识'
      },
      balance:  {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: '余额，单位为分'
      },
      visit_count:  {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: '访问次数'
      },
      last_login:  {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '最后登录时间'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '创建时间'
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '更新时间'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
