// migrations/[timestamp]-create-goods-specification.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('goods_specification', {
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
        comment: '规格名称',
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '规格图片',
      },
      line_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '划线价，单位为分',
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '规格价格，单位为分',
      },
      purchase_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '采购价格，单位为分',
      },
      purchase_notice: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '购买须知',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '创建时间',
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        comment: '更新时间',
      },
    });

    // 添加索引
    await queryInterface.addIndex('goods_specification', ['goods_id']);
    await queryInterface.addIndex('goods_specification', ['price']);
    await queryInterface.addIndex('goods_specification', ['line_price']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('goods_specification');
  }
};