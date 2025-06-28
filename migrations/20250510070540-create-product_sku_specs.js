'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // 规格组合表
    await queryInterface.createTable('product_sku_specs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品id',
        references: {
          model: 'products',
          key: 'id'
        }
      },
      spec_value_ids: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: '商品规格值id'
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品价格,价格为分'
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品库存'
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'SKU图片'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: '是否启用,下架'
      },
      commission: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '佣金比例'
      },
      creatorsId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '创作者ID',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      creators_commission: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '创作者佣金比例'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
