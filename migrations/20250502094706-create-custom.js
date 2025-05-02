// migrations/[timestamp]-create-custom.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('custom', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '素材名称',
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '素材原图',
      },
      thumbnail: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '素材缩略图',
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '素材分类id',
        references: {
          model: 'custom_category', // 关联的分类表名
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      isTop: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '是否置顶',
      },
      loadNum: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '素材加载次数',
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
    await queryInterface.addIndex('custom', ['categoryId']);
    await queryInterface.addIndex('custom', ['isTop']);
    await queryInterface.addIndex('custom', ['loadNum']);
    await queryInterface.addIndex('custom', ['createdAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('custom');
  }
};