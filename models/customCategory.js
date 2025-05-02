// models/customCategory.js
// 创建手机壳定制素材分类模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CustomCategory = sequelize.define('CustomCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '分类名称',
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '排序',
    },
    isShow: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '是否显示',
    },
  }, {
    tableName: 'custom_category',
    timestamps: true,
  });

  return CustomCategory;
};
