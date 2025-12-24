'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      order_id: {  // ✅ snake_case
        type: Sequelize.STRING(19),
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '订单id'
      },
      product_id: {  // ✅ snake_case
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '商品id'
      },
      sku_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '商品sku id'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品数量'
      },
      unit_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品单价'
      },
      is_custom: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1为普通商品，2为定制商品，3为半定制商品'
      },
      submitted: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
        comment: '如果是定制商品，提交的设计图'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_products');
  }
};