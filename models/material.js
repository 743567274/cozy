'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    static associate(models) {
      Material.belongsTo(models.MaterialClass, {
        foreignKey: 'material_classId',
        as: 'materialClass',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Material.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    material_classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '素材分类id'
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '素材名称'
    },
    is_top: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '是否置顶'
    },
    loaded_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '下载量'
    }
  }, {
    sequelize,
    modelName: 'Material',
    tableName: 'materials',
    timestamps: false,
    underscored: true
  });

  return Material;
};
