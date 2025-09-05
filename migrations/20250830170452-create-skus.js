'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('skus', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '商品ID'
      },
      sku_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '商品SKU编号'
      },
      spec_value_ids: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: '商品规格值ID'
      },
      spec_value_names: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: '商品规格值名称'
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: '商品价格'
      },
      original_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: '商品原价'
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '商品库存'
      },
      is_active: {
        type: Sequelize.TINYINT({ length: 1 }),
        allowNull: false,
        defaultValue: 1,
        comment: 'SKU状态:[1正常,0禁用]'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // 创建索引提升查询性能
    await queryInterface.addIndex('skus', ['product_id']);
    await queryInterface.addIndex('skus', ['sku_id']);
    await queryInterface.addIndex('skus', ['is_active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('skus');
  }
};