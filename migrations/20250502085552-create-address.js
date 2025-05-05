// migrations/[timestamp]-create-address.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('address', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        comment: '用户id',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '收货人姓名',
      },
      phone: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '收货人电话',
      },
      province: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '省',
      },
      city: {
        type: Sequelize.STRING(80),
        allowNull: true,
        comment: '市',
      },
      area: {
        type: Sequelize.STRING(80),
        allowNull: true,
        comment: '区',
      },
      detail: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '详细地址',
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '是否默认地址',
      },
      isDelete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否删除',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '创建时间',
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '更新时间',
      },
    });
  }
};