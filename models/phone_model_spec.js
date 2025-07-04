// 手机壳规格
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PhoneModelSpec extends Model {
    static associate(models) {
      // 添加与关联表的关联
      PhoneModelSpec.hasMany(models.PhoneModelAssociated, {
        foreignKey: 'phone_model_specId',
        as: 'associatedModels'
      });
      PhoneModelSpec.belongsToMany(models.PhoneModelType, {
        through: models.PhoneModelAssociated,
        foreignKey: 'phone_model_specId',
        otherKey: 'phone_typeId',
        as: 'phoneModelTypes'
      });
    }
  }

  PhoneModelSpec.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    spec_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '规格名称'
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
    modelName: 'PhoneModelSpec',
    tableName: 'phone_model_spec',
    timestamps: false
  });

  return PhoneModelSpec;
};
