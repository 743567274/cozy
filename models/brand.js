// 手机品牌模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const models = sequelize.define('brands', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },{
    timestamps: true,
    tableName: 'brands',
    modelName: 'Brands'
  });
  return models;
};