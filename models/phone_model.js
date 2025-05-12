'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PhoneModel extends Model {
    static associate(models) {
      // 与品牌的关联
      PhoneModel.belongsTo(models.Brand, {
        foreignKey: 'brandId',
        as: 'brand',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  PhoneModel.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    brandId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '手机品牌id'
    },
    model: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '手机型号'
    }
  }, {
    sequelize,
    modelName: 'PhoneModel',
    tableName: 'phone_models',
    underscored: true,
    timestamps: true
  });

  return PhoneModel;
};
