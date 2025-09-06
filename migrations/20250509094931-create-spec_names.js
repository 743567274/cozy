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
    // 规格名称表
    await queryInterface.createTable('spec_names', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        comment: '商品id'
      },
      property_name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '属性规格名称'
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '价格,单位为分'
      },
      original_id: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '规格名称id',
        comment: '前端传来的原始规格ID，如 1756391709695'
      }
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
