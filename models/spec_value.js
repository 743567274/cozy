'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpecValue extends Model {
    static associate(models) {
      // 每个规格值属于一个规格名称
      SpecValue.belongsTo(models.SpecName, {
        foreignKey: 'spec_name_id',
        as: 'specValues',
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
