// migrations/[timestamp]-create-order-goods.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_goods', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '订单id',
        references: {
          model: 'order',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      goods_name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '商品名称',
      },
      goods_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品价格，单位为分',
      },
      goods_num: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品数量',
      },
      goods_image: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '商品图片',
      },
      is_custom: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '是否定制',
      },
      submitted: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: '提交规格信息',
      },
      refund_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '退款状态: 0-无退款, 1-退款中, 2-退款成功, 3-退款失败',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '创建时间',
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        comment: '更新时间',
        field: 'updated_at'
      },
    });

    // 添加索引
    await queryInterface.addIndex('order_goods', ['orderId']);
    await queryInterface.addIndex('order_goods', ['goodsId']);
    await queryInterface.addIndex('order_goods', ['refund_status']);
    await queryInterface.addIndex('order_goods', ['is_custom']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order_goods');
  }
};