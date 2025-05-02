// models/orderGoods.js
// 订单商品模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderGoods = sequelize.define('OrderGoods', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '订单id',
    },
    goodsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品id',
    },
    goods_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '商品名称',
    },
    goods_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品价格，单位为分',
    },
    goods_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品数量',
    },
    goods_image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '商品图片',
    },
    is_custom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '是否定制',
    },
    submitted: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '提交规格信息',
    },
    refund_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '退款状态: 0-无退款, 1-退款中, 2-退款成功, 3-退款失败',
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
    tableName: 'order_goods',
    underscored: true,
    timestamps: false,
  });

  OrderGoods.associate = (models) => {
    // 所属订单
    OrderGoods.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
    });

    // 所属商品
    OrderGoods.belongsTo(models.Goods, {
      foreignKey: 'goodsId',
      as: 'goods',
    });
  };

  return OrderGoods;
};
