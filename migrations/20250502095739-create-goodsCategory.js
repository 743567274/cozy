// migrations/[timestamp]-create-goods-category.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('goods_category', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '分类名称',
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

    // 添加索引
    await queryInterface.addIndex('goods_category', ['name']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('goods_category');
  }
};