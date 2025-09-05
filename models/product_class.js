'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductClass extends Model {
    static associate(models) {
      // 若有产品表等与分类关联，可以在此设置 belongsTo/hasMany
      // 自关联设置
      ProductClass.hasMany(models.ProductClass, {
        as: 'children',
        foreignKey: 'parent_id'
      });
      ProductClass.belongsTo(models.ProductClass, {
        as: 'parents',
        foreignKey: 'parent_id'
      });
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
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '父级分类id'
    },
    desc: {
      type: DataTypes.STRING(80),
      allowNull: true,
      comment: '商品分类描述'
    },
    share_title: {
      type: DataTypes.STRING(80),
      allowNull: true,
      comment: '商品分享标题'
    },
    share_desc: {
      type: DataTypes.STRING(80),
      allowNull: true,
      comment: '商品分享描述'
    },
    share_img: {
      type: DataTypes.STRING(80),
      allowNull: true,
      comment: '商品分享图片'
    }
  }, {
    sequelize,
    modelName: 'ProductClass',
    tableName: 'product_class',
    timestamps: true
  });

  return ProductClass;
};
