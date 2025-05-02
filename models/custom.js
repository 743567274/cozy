// models/custom.js
// 创建素材模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Custom = sequelize.define('Custom', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '素材名称',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '素材原图',
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '素材缩略图',
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '素材分类id',
    },
    isTop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '是否置顶',
    },
    loadNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '素材加载次数',
    },
  }, {
    tableName: 'custom',
    timestamps: true,
  });

  Custom.associate = (models) => {
    Custom.belongsTo(models.CustomCategory, {
      foreignKey: 'categoryId',
      targetKey: 'id',
      as: 'category',
    });
  };

  return Custom;
};
