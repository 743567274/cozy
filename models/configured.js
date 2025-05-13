'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Configured extends Model {
    static associate(models) {
      // 当前无外键关联，若有其他模型引用配置项，可以在其他模型中定义关联
    }
  }

  Configured.init({
    key: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '配置项键名'
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '配置项值'
    }
  }, {
    sequelize,
    modelName: 'Configured',
    tableName: 'configured',
    timestamps: false // 未定义时间字段
  });

  return Configured;
};
