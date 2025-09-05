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
    // 这个是商品分类表
    await queryInterface.createTable('product_class', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      class_name: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      desc: {
        type: Sequelize.STRING(80),
        allowNull: true,
        comment: '描述'
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: '父级分类id',
        references: {
          model: 'product_class',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'set null'
      },
      share_title: {
        type: Sequelize.STRING(80),
        allowNull: true,
        comment: '分享标题'
      },
      share_desc: {
        type: Sequelize.STRING(80),
        allowNull: true,
        comment: '分享描述'
      },
      share_img: {
        type: Sequelize.STRING(80),
        allowNull: true,
        comment: '分享图片'
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
