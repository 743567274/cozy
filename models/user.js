'use strict';

const { Model, DataTypes } = require('sequelize');
const SnowflakeID = require('snowflake-id').default;

// 统一的 Snowflake 实例
const snowflake = new SnowflakeID({ mid: 1 });

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 自引用：上级
      User.belongsTo(models.User, {
        as: 'superior',
        foreignKey: 'superiorId'
      });

      // 自引用：下级
      User.hasMany(models.User, {
        as: 'subordinates',
        foreignKey: 'superiorId'
      });

      // 用户 -> 订单
      User.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'orders'
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.STRING(19),
      allowNull: false,
      primaryKey: true,
      comment: 'Snowflake ID'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '用户昵称'
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: '用户名'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '密码'
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '头像'
    },
    superiorId: {
      type: DataTypes.STRING(19),
      allowNull: true,
      comment: '上级用户ID'
    },
    openid: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      comment: '微信用户openid'
    },
    balance: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '余额'
    },
    visit_count: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: '访问次数'
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登录时间'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,      // 自动生成 createdAt -> created_at
    indexes: [
      { fields: ['openid'], unique: true },
      { fields: ['username'], unique: true },
      { fields: ['superiorId'] }
    ]
  });

  // 创建前生成 ID
  User.beforeCreate((user) => {
    user.id = snowflake.generate().toString();
  });

  return User;
};