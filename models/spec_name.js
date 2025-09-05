'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpecName extends Model {
    static associate(models) {
      // 每个规格名称属于一个商品
      SpecName.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
      // SpecName 有多个 SpecValue
      SpecName.hasMany(models.SpecValue, {
        foreignKey: 'spec_name_id',
        as: 'specValues'  // ✅ 注意：这里是 specValues（复数），用于 include
      });
    }
  }

  SpecName.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品id'
    },
    property_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '属性规格名称'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: '价格,单位为分'
    }
  }, {
    sequelize,
    modelName: 'SpecName',
    tableName: 'spec_names',
    timestamps: false,
    underscored: true
  });

  return SpecName;
};
