'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  log.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('system', 'user'),
      allowNull: false,
      comment: '日志类型'
      // system 系统日志，user 用户日志
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '日志内容'
    },
  }, {
    sequelize,
    modelName: 'logs',
    tableName: 'logs',
    timestamps: true
  });
  return log;
};