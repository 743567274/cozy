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
    // 手机型号和手机壳类型和手机壳规格的关联表
    await queryInterface.createTable('phone_model_associated', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      phone_modelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'phone_model',
          key: 'id'
        },
        comment: '手机型号id'
      },
      phone_typeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'phone_model_type',
          key: 'id'
        },
        comment: '手机壳类型id'
      },
      phone_model_specId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'phone_model_spec',
          key: 'id'
        },
        comment: '手机壳规格id'
      },
      image: {
        type: Sequelize.VARCHAR(255),
        allowNull: false,
        comment: '手机壳的模型图'
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
