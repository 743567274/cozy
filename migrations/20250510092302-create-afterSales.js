'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 售后表
    await queryInterface.createTable('afterSales', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '关联订单 ID',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '用户 ID',
      },
      type: {
        type: Sequelize.ENUM('refund', 'exchange', 'resend', 'only_refund'),
        allowNull: false,
        comment: '售后类型：退货退款 / 换货 / 补发 / 仅退款',
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '用户填写的申请原因',
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: '图片列表（JSON 数组）',
      },
      status: {
        type: Sequelize.ENUM(
          'pending',
          'rejected',
          'approved',
          'returning',
          'received',
          'refunded',
          'exchanged',
          'resent',
          'completed'
        ),
        defaultValue: 'pending',
        comment: '售后状态',
      },
      logisticsName: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '用户退货快递公司',
      },
      logisticsNo: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '用户退货快递单号',
      },
      resendLogisticsName: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '商家补发快递公司',
      },
      resendLogisticsNo: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '商家补发快递单号',
      },
      refundAmount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '退款金额（退货或仅退款）单位为分',
      },
      reply: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '商家审核回复或处理备注',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '创建时间',
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '更新时间',
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('afterSales');
  }
};
