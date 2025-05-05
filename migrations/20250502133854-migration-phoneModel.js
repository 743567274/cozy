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