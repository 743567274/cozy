'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpecValue extends Model {
    static associate(models) {
      // 每个规格值属于一个规格名称
      SpecValue.belongsTo(models.SpecName, {
        foreignKey: 'spec_name_id',
        as: 'specName',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  SpecValue.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    spec_name_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '规格名称id'
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '规格值'
    },
    original_value_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: '前端传来的原始值ID后缀，如 0, 1'
    }
  }, {
    sequelize,
    modelName: 'SpecValue',
    tableName: 'spec_values',
    timestamps: false,
    underscored: true
  });

  return SpecValue;
};
