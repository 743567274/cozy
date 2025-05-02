// migrations/[timestamp]-create-font.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('font', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '字体名称',
      },
      font: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '字体文件',
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '字体预览图片',
      },
      isTop: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '是否置顶',
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
    await queryInterface.addIndex('font', ['name']);
    await queryInterface.addIndex('font', ['isTop']);
    await queryInterface.addIndex('font', ['createdAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('font');
  }
};