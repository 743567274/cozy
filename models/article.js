'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      // 当前没有外键关联，如果有文章分类或作者后续可在此添加
    }
  }

  Article.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(80),
      allowNull: false,
      defaultValue: '文章标题'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '文章内容'
    }
  }, {
    sequelize,
    modelName: 'Article',
    tableName: 'article',
    timestamps: true
  });

  return Article;
};
