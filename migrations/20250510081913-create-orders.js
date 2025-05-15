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
    // 订单表
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '用户id'
      },
      total_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '订单总价,单位为分',
        defaultValue: 0
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '订单状态，0为未支付，1为已支付，2为待发货，3为已发货，4为已完成，5为已取消，6为已退款，7为售后中，8为售后完成',
        defaultValue: 0
      },
      pay_time: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '支付时间'
      },
      shipping_address: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '收货地址',
        references: {
          model: 'address',
          key: 'id'
        }
      },
      express_name:  {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: '快递名称'
      },
      express_number:{
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: '快递单号'
      },
      closing_time:{
        type: Sequelize.DATE,
        allowNull: true,
        comment: '完结时间'
      },
      delivery_time:{
        type: Sequelize.DATE,
        allowNull: true,
        comment: '发货时间'
      },
      description:{
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '订单说明，由用户填写'
      },
      remarks:  {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '备注'
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '更新时间'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '创建时间'
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
