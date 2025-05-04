// models/phoneModel.js
// 手机型号
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PhoneModel = sequelize.define('PhoneModel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '手机品牌',
    },
    model: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '机型',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '机型图片',
    },
  }, {
    tableName: 'phone_model',
    timestamps: true,
  });

  PhoneModel.associate = (models) => {
    PhoneModel.belongsToMany(models.Goods, {
      through: 'goods_phone_model',
      foreignKey: 'phoneModelId',
      otherKey: 'goodsId',
      as: 'goods',
    });
  };

  return PhoneModel;
};
