// models/phoneType.js
// 手机壳类型模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PhoneType = sequelize.define('PhoneType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '手机壳类型名称',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '手机壳类型描述',
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '手机壳类型图片',
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '手机壳价格，单位为分',
    },
    line_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '划线价，单位为分',
    },
  }, {
    tableName: 'phone_type',
    timestamps: true,
  });

  return PhoneType;
};
