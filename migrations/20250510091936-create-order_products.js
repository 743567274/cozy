'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // 订单管理商品表
    await queryInterface.createTable('order_products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '订单id'
      },
      productId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '商品id'
      },
      quantity:{
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品数量'
      },
      unit_price:{
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品单价'
      },
      is_custom:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1为普通商品，2为定制商品，3为半定制商品'
      },
      submitted:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        comment: '如果是定制商品，提交的设计图'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
