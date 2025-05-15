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
    // 素材表
    await queryInterface.createTable('materials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      material_classId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'material_class',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: '素材分类id'
      },
      name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: '素材名称'
      },
      is_top:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否置顶'
      },
      loaded_num:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '下载量'
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
