// models/goods.js
// 商品模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Goods = sequelize.define('Goods', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '商品名称',
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品价格，单位为分',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '商品图片',
    },
    browse: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '商品浏览量',
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品分类id',
      field: 'category_id',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '商品描述',
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '库存数量',
    },
    sales_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '商品销量',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '商品状态: 0-下架, 1-上架',
    },
  }, {
    tableName: 'goods',
    timestamps: true,
  });

  Goods.associate = (models) => {
    Goods.belongsTo(models.GoodsCategory, {
      foreignKey: 'categoryId',
      as: 'category',
    });

    Goods.hasMany(models.GoodsSpecification, {
      foreignKey: 'goodsId',
      as: 'specifications',
      onDelete: 'CASCADE',
    });

    Goods.hasOne(models.HomeGoods, {
      foreignKey: 'goodsId',
      as: 'home_goods',
      onDelete: 'CASCADE',
    });

    Goods.belongsToMany(models.PhoneModel, {
      through: 'goods_phone_model',
      foreignKey: 'goodsId',
      otherKey: 'phoneModelId',
      as: 'phone_models',
    });
  };

  return Goods;
};
