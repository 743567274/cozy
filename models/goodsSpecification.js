// models/goodsSpecification.js
// 商品规格
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GoodsSpecification = sequelize.define('GoodsSpecification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    goodsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品id',
      field: 'goods_id',
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '规格名称',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '规格图片',
    },
    line_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '划线价，单位为分',
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '规格价格，单位为分',
    },
    purchase_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '采购价格，单位为分',
    },
    purchase_notice: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '购买须知',
    },
  }, {
    tableName: 'goods_specification',
    underscored: true,
    timestamps: false,
  });

  GoodsSpecification.associate = (models) => {
    GoodsSpecification.belongsTo(models.Goods, {
      foreignKey: 'goodsId',
      as: 'goods',
    });
  };

  return GoodsSpecification;
};
