// models/article.js
// 文章模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '文章标题',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '文章内容',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间',
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '更新时间',
    },
  }, {
    tableName: 'article',
    timestamps: true,
  });

  return Article;
};
