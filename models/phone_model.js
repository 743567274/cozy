'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PhoneModel extends Model {
    static associate(models) {
      // 与品牌的关联
      PhoneModel.belongsTo(models.Brands, {
        foreignKey: 'brandId',
        as: 'brands',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: '手机品牌'
      });
    }
  }

  PhoneModel.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    timestamps: false
  });

  return PhoneModel;
};
