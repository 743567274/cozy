'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // 用来保存用户的收货地址
    await queryInterface.createTable('address', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '用户id',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      province: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: '省份'
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: '城市'
      },
      region: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: '区县'
      },
      phone_number: {
        type: Sequelize.STRING(11),
        allowNull: true,
        comment: '手机号'
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: '姓名'
      },
      default: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '是否默认地址'
      },
      detail_address:  {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '详细地址'
      },
      delete:  {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: '是否删除'
      },
      create_time: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '创建时间'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '创建时间'
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '更新时间'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
