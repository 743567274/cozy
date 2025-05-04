// migrations/[timestamp]-create-setting.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('setting', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '键名',
        unique: true // 添加唯一约束
      },
      value: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '键值',
      },
    });

    // 添加索引
    await queryInterface.addIndex('setting', ['name'], {
      unique: true,
      name: 'setting_name_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('setting');
  }
};