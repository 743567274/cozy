// migrations/[timestamp]-create-phone-type.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('phone_type', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '手机壳类型名称',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: '手机壳类型描述',
      },
      images: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: '手机壳类型图片',
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '手机壳价格，单位为分',
      },
      line_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '划线价，单位为分',
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
    await queryInterface.addIndex('phone_type', ['name']);
    await queryInterface.addIndex('phone_type', ['price']);
    await queryInterface.addIndex('phone_type', ['line_price']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('phone_type');
  }
};