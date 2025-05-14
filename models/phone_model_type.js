// 手机壳类型模型
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PhoneModelType extends Model {
    static associate(models) {
      // 如果将来有模型与 phone_model_type 表建立关联，可以在这里添加关联关系
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
    }
  }, {
    sequelize,
    modelName: 'PhoneModelType',
    tableName: 'phone_model_type',
    timestamps: false
  });

  return PhoneModelType;
};
