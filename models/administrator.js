// 管理员列表
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const administrator = sequelize.define('administrator', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt:  {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt:  {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  },{
    tableName: 'administrator',
    timestamps: true
  })
  return administrator;
}