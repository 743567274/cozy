'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PhoneModelAssociated extends Model {
    static associate(models) {
      // 与手机型号关联
      PhoneModelAssociated.belongsTo(models.PhoneModel, {
        foreignKey: 'phone_modelId',
        as: 'phoneModel',
        comment: '手机型号'
      });

      // 与壳类型关联
      PhoneModelAssociated.belongsTo(models.PhoneModelType, {
        foreignKey: 'phone_typeId',
        as: 'phoneType',
        comment: '手机壳类型'
      });

      // 与壳规格关联
      PhoneModelAssociated.belongsTo(models.PhoneModelSpec, {
        foreignKey: 'phone_model_specId',
        as: 'phoneModelSpec',
        comment: '手机壳规格'
      });
    }
  }

  PhoneModelAssociated.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    phone_modelId: {  // ✅ 添加
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '手机型号id'
    },
    phone_typeId: {   // ✅ 添加
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '手机壳类型id'
    },
    phone_model_specId: { // ✅ 添加
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '手机壳规格id'
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '手机壳的模型图'
    }
  }, {
    sequelize,
    modelName: 'PhoneModelAssociated',
    tableName: 'phone_model_associated',
    timestamps: false
  });

  return PhoneModelAssociated;
};
