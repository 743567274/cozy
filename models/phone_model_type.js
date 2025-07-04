// 手机壳类型模型
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PhoneModelType extends Model {
    static associate(models) {
      // 添加与规格的关联
      PhoneModelType.hasMany(models.PhoneModelAssociated, {
        foreignKey: 'phone_typeId',
        as: 'associatedModels'
      });
      PhoneModelType.belongsToMany(models.PhoneModelSpec, {
        through: models.PhoneModelAssociated,
        foreignKey: 'phone_typeId',
        otherKey: 'phone_model_specId',
        as: 'phoneModelSpecs'
      });
    }
  }

  PhoneModelType.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    type_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      comment: '手机壳类型名称'
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '手机壳类型图片'
    },
    // 上下架
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '手机壳类型状态'
    }
  }, {
    sequelize,
    modelName: 'PhoneModelType',
    tableName: 'phone_model_type',
    timestamps: false
  });

  return PhoneModelType;
};
