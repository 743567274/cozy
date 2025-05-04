// migrations/[timestamp]-create-phone-model.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('phone_model', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      brand: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '手机品牌',
      },
      model: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '机型',
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '机型图片',
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

    // 创建多对多关联表
    await queryInterface.createTable('goods_phone_model', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      goodsId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'goods',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      phoneModelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'phone_model',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // 添加索引
    await queryInterface.addIndex('phone_model', ['brand']);
    await queryInterface.addIndex('phone_model', ['model']);
    await queryInterface.addIndex('goods_phone_model', ['goodsId']);
    await queryInterface.addIndex('goods_phone_model', ['phoneModelId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('goods_phone_model');
    await queryInterface.dropTable('phone_model');
  }
};