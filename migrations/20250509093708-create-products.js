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
    // 这个是商品表
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '商品名称'
      },
      product_class: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品分类',
        references: {
          model: 'product_class',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.ENUM('standard', 'phone_model'),// 标准,手机壳
        allowNull: false,
        comment: '商品类型'
      },
      images: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: '商品图片JSON'
      },
      browse: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '商品浏览量'
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品价格，单位为分'
      },
      line_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品划线价，单位为分'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: '商品描述'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
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
