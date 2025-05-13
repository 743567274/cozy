'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MaterialClass extends Model {
    static associate(models) {
      // 可以在这里定义与素材表的关联（如：hasMany），如果后续有对应的素材表
    }
  }

  MaterialClass.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    class_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '分类名称'
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '排序'
    },
    is_show: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '是否显示'
    }
  }, {
    sequelize,
    modelName: 'MaterialClass',
    tableName: 'material_class',
    timestamps: false,
    underscored: true
  });

  return MaterialClass;
};
