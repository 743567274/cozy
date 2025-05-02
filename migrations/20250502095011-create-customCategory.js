// migrations/[timestamp]-create-custom-category.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('custom_category', {
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
      sort: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '排序',
      },
      isShow: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '是否显示',
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
    await queryInterface.addIndex('custom_category', ['sort']);
    await queryInterface.addIndex('custom_category', ['isShow']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('custom_category');
  }
};