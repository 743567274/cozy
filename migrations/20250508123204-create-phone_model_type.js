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
    // 这个是手机壳的类型表，比如：透明壳，玻璃壳
    await queryInterface.createTable('phone_model_type', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type_name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        unique: true,
        comment: '手机壳类型名称'
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '手机壳类型图片'
      },
      // 上下架
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: '手机壳类型状态'
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '状态 1:正常 0:禁用'
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: '手机壳价格'
      },
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
