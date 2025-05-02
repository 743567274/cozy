// models/goodsPhoneModel.js
// 商品和机型关联模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GoodsPhoneModel = sequelize.define('GoodsPhoneModel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    goodsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品id',
      references: {
        model: 'goods',
        key: 'id',
      },
    },
    phoneModelIds: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '手机机型id数组',
    },
  }, {
    tableName: 'goods_phone_model',
    timestamps: true,
  });

  return GoodsPhoneModel;
};
