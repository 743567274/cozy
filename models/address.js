// models/address.js
// 收货地址表
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Address = sequelize.define('Address', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户id',
      references: {
        model: 'User',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '收货人姓名',
    },
    phone: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '收货人电话',
    },
    province: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '省',
    },
    city: {
      type: DataTypes.STRING(80),
      allowNull: true,
      comment: '市',
    },
    area: {
      type: DataTypes.STRING(80),
      allowNull: true,
      comment: '区',
    },
    detail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '详细地址',
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: '是否默认地址',
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '是否删除',
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
    tableName: 'address',
    timestamps: true, // 自定义了 created_at 和 updated_at 字段，不用 Sequelize 默认的
  });

  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Address.hasMany(models.Order, {
      foreignKey: 'addressId',
      as: 'orders',
      onDelete: 'CASCADE',
    });
  };

  return Address;
};
