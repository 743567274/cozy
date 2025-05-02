// models/goodsCategory.js
// 商品分类模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GoodsCategory = sequelize.define('GoodsCategory', {
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
  }, {
    tableName: 'goods_category',
    timestamps: true,
  });

  GoodsCategory.associate = (models) => {
    GoodsCategory.hasMany(models.Goods, {
      foreignKey: 'categoryId',
      as: 'goods',
      onDelete: 'CASCADE',
    });
  };

  return GoodsCategory;
};
