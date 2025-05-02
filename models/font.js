// models/font.js
// 字体模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Font = sequelize.define('Font', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '字体名称',
    },
    font: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '字体文件',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '字体预览图片',
    },
    isTop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '是否置顶',
    },
  }, {
    tableName: 'font',
    timestamps: true,
  });

  return Font;
};
