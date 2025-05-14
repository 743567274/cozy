'use strict'
// 手机品牌模型
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Brands extends Model {
    static associate(models) {
      // 有需要可以在这里定义关联
    }
  }
  Brands.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: false,
    tableName: 'brands',
    modelName: 'Brands'
  })
  return Brands;
};