'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductSkuSpec extends Model {
    static associate(models) {
      // SKU 属于一个商品
      ProductSkuSpec.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }

  ProductSkuSpec.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品id'
    },
    spec_value_ids: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '商品规格值id'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品价格,价格为分'
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品库存'
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'SKU图片'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '是否启用,下架'
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'ProductSkuSpec',
    tableName: 'product_sku_specs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ProductSkuSpec;
};
