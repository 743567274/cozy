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
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: '商品描述'
      },
      commission: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '商品佣金'
      },
      creatorsId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '创建者ID',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      creators_commission: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '创建者佣金'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
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
