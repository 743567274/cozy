'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductClass extends Model {
    static associate(models) {
      // 若有产品表等与分类关联，可以在此设置 belongsTo/hasMany
    }
  }

  ProductClass.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    class_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '商品分类名称'
    },
    desc: {
      type: DataTypes.STRING(80),
      allowNull: true,
      comment: '商品分类描述'
    }
  }, {
    sequelize,
    modelName: 'ProductClass',
    tableName: 'product_class',
    timestamps: true
  });

  return ProductClass;
};
