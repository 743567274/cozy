// migrations/[timestamp]-create-phone-type-phone-model.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('phone_type_phone_model', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      phoneTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '手机壳类型id',
        references: {
          model: 'phone_type',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      phoneModelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '手机机型id',
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
        comment: '创建时间',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        comment: '更新时间',
      },
    });

    // 添加复合唯一索引，防止重复关联
    await queryInterface.addIndex('phone_type_phone_model', 
      ['phoneTypeId', 'phoneModelId'],
      {
        unique: true,
        name: 'phone_type_model_unique'
      }
    );

    // 添加单字段索引
    await queryInterface.addIndex('phone_type_phone_model', ['phoneTypeId']);
    await queryInterface.addIndex('phone_type_phone_model', ['phoneModelId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('phone_type_phone_model');
  }
};