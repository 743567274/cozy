// migrations/[timestamp]-create-goods.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('goods', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '商品名称',
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品价格，单位为分',
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '商品图片',
      },
      browse: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '商品浏览量',
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品分类id',
        references: {
          model: 'goods_category',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: '商品描述',
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '库存数量',
      },
      sales_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '商品销量',
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '商品状态: 0-下架, 1-上架',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '创建时间',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '更新时间',
      },
    });
  }
};