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
    // 管理员账户表
    await queryInterface.createTable('administrators', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: '管理员用户名'
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '管理员密码'
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '管理员token,用来验证是否唯一登录'
      },
      owner: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否是超级管理员'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    // 初始化一条管理员数据
    await queryInterface.bulkInsert('administrators', [{
      username: 'admin',
      password: '123456',
      owner: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  }
};
