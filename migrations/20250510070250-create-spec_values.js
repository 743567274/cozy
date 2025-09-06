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
    // 规格值表，比如透明大孔，透明精孔
    await queryInterface.createTable('spec_values', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spec_name_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '规格名称id',
        references: {
          model: 'spec_names',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '规格值'
      },
      original_value_id: {
        type: Sequelize.STRING(10),
        allowNull: false,
        comment: '前端传来的原始值ID后缀，如 0, 1'
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
