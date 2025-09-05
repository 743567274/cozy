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
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '商品类型:[1普通商品,2虚拟商品]'
      },
      image: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: '商品图片JSON'
      },
      video: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '商品视频'
      },
      detail: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: '商品详情'
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
      // 置顶
      top: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '商品是否置顶'
      },
      creators_id: {
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
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: '商品是否激活'
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
