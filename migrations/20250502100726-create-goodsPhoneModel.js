// migrations/[timestamp]-create-goods-phone-model.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('goods_phone_model', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      goodsId: {
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
      phoneModelIds: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: '手机机型id数组',
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
    await queryInterface.addIndex('goods_phone_model', ['goodsId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('goods_phone_model');
  }
};