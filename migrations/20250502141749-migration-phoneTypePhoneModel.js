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
        comment: '创建时间',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '更新时间',
      },
    });
  }
};