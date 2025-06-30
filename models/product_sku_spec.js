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
      // 创作者ID属于用户
      ProductSkuSpec.belongsTo(models.User, {
        foreignKey: 'creatorsId',
        as: 'creators'
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
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '商品规格名称'
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
    commission: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: '佣金分成比例'
    },
    creatorsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '创作者ID'
    },
    creators_commission: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: '创作者佣金分成比例'
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
