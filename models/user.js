'use strict';
const { Model, DataTypes } = require('sequelize');
const SnowflakeID = require('snowflake-id').default;
const snowflake = new SnowflakeID({ mid: 1 }); // 机器 ID 自定义

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // 自引用关联：一个用户可以有一个上级
      User.belongsTo(models.User, {
        as: 'superior',
        foreignKey: 'superiorId'
      });

      // 上级可以有多个下级
      User.hasMany(models.User, {
        as: 'subordinates',
        foreignKey: 'superiorId'
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.BIGINT, // 使用 BIGINT 存储 Snowflake ID
      allowNull: false,
      primaryKey: true
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
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: '上级id'
    },
    openid: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      comment: '微信用户openid标识'
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: '余额，单位为分'
    },
    visit_count: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: '访问次数'
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: '最后登录时间'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
  });

  // 在创建前自动生成 Snowflake ID
  User.beforeCreate((user) => {
    user.id = snowflake.generate();
  });

  return User;
};
