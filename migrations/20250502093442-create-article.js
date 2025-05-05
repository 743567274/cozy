// migrations/[timestamp]-create-article.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('article', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '文章标题',
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: '文章内容',
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
  }
};