// models/homeGoods.js
// 首页商品推荐模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HomeGoods = sequelize.define('HomeGoods', {
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
      comment: '商品名称',
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '排序',
    },
  }, {
    tableName: 'home_goods',
    timestamps: true,
  });

  HomeGoods.associate = (models) => {
    HomeGoods.belongsTo(models.Goods, {
      foreignKey: 'goodsId',
      as: 'goods',
    });
  };

  return HomeGoods;
};
