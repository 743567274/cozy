// models/phoneTypePhoneModel.js
// 手机壳类型和手机机型关联表
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PhoneTypePhoneModel = sequelize.define('PhoneTypePhoneModel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phoneTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '手机壳类型id',
      references: {
        model: 'phone_type',
        key: 'id',
      },
    },
    phoneModelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '手机机型id',
      references: {
        model: 'phone_model',
        key: 'id',
      },
    },
  }, {
    tableName: 'phone_type_phone_model',
    underscored: true,
    timestamps: false,
  });

  return PhoneTypePhoneModel;
};
