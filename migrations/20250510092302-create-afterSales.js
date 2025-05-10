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
    // 售后表
    await queryInterface.createTable('afterSales', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        comment: '关联订单 ID',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: '用户 ID',
      },
      type: {
        type: DataTypes.ENUM('refund', 'exchange', 'resend', 'only_refund'),
        allowNull: false,
        comment: '售后类型：退货退款 / 换货 / 补发 / 仅退款',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '用户填写的申请原因',
      },
      images: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: '图片列表（JSON 数组）',
      },
      status: {
        type: DataTypes.ENUM(
          'pending',     // 待审核
          'rejected',    // 已拒绝
          'approved',    // 已通过（待寄回或待补发）
          'returning',   // 用户已寄回
          'received',    // 商家已收货
          'refunded',    // 已退款
          'exchanged',   // 已换货发出
          'resent',      // 已补发
          'completed'    // 售后已完成
        ),
        defaultValue: 'pending',
        comment: '售后状态',
      },
      logisticsName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '用户退货快递公司',
      },
      logisticsNo: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '用户退货快递单号',
      },
      resendLogisticsName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '商家补发快递公司',
      },
      resendLogisticsNo: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '商家补发快递单号',
      },
      refundAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '退款金额（退货或仅退款）单位为分',
      },
      reply: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '商家审核回复或处理备注',
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
