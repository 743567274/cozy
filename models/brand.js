// 手机品牌模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('brands', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
  });
};