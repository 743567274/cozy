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
    }
  }

  SpecName.init({
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
    property_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '属性规格名称'
    },
    combination: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '属性规格组合'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
