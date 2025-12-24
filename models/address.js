'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      // Address 属于 User
      Address.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  Address.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: '用户id'
    },
    province: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '省份'
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '城市'
    },
    region: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '区县'
    },
    phone_number: {
      type: DataTypes.STRING(11),
      allowNull: true,
      comment: '手机号'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '姓名'
    },
    default: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: '是否默认地址'
    },
    detail_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '详细地址'
    },
    delete: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: '是否删除'
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '创建时间'
    }
  }, {
    sequelize,
    modelName: 'Address',
    tableName: 'address',
    timestamps: false,
    underscored: true,
  });

  return Address;
};
