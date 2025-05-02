// migrations/[timestamp]-create-home-goods.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('home_goods', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      goods_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品id',
        references: {
          model: 'goods',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '商品名称',
      },
      sort: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '排序',
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

    // 添加索引
    await queryInterface.addIndex('home_goods', ['goods_id']);
    await queryInterface.addIndex('home_goods', ['sort']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('home_goods');
  }
};