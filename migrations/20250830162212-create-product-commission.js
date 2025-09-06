'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_commission', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '关联商品ID'
      },
      commissionLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '佣金级别'
      },
      firstLevelRate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: '一级佣金比例'
      },
      secondLevelRate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: '二级佣金比例'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: '是否启用'
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

    // 创建索引以提高查询性能
    await queryInterface.addIndex('product_commission', ['product_id']);
    await queryInterface.addIndex('product_commission', ['commissionLevel']);
    await queryInterface.addIndex('product_commission', ['product_id', 'commissionLevel'], {
      unique: true // 确保每个商品每个佣金级别只有一条记录
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_commission');
  }
};