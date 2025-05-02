// models/setting.js
// 键值对设置模型定义
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Setting = sequelize.define('Setting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '键名',
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '键值',
    },
  }, {
    tableName: 'setting',
    underscored: true,
    timestamps: false,
  });

  return Setting;
};
