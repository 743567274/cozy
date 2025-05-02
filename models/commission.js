// models/commission.js
// 佣金表
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Commission = sequelize.define('Commission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户id',
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '订单id',
    },
    commission: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '佣金金额，单位为分',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '状态: 0-未结算, 1-已结算, 2-已取消',
    },
    remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '备注:资金去向',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间',
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '更新时间',
    },
  }, {
    tableName: 'commission',
    timestamps: true,
  });

  Commission.associate = (models) => {
    // 所属用户
    Commission.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    // 所属订单
    Commission.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
    });
  };

  return Commission;
};
