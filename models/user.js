// 用户表
const { DataTypes } = require('sequelize');
const Snowflake = require('snowflake-id'); // 引入 Snowflake，雪花算法
const snowflake =  new Snowflake();

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: () => snowflake.generate() // 使用 Snowflake 生成唯一 ID
    },
    username: {
      type: DataTypes.STRING(80),
      unique: true,
      allowNull: true,
      comment: '用户名'
    },
    password: {
      type: DataTypes.STRING(80),
      allowNull: true,
      comment: '密码'
    },
    openid: {
      type: DataTypes.STRING(80),
      unique: true,
      allowNull: false,
      comment: '微信用户openid标识'
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: '余额，单位为分'
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '昵称'
    },
    avatar: {
      type: DataTypes.STRING(120),
      allowNull: false,
      comment: '头像'
    },
    superiorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '上级id'
    },
    invited_several: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '邀请人数'
    },
    visit_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '访问次数'
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '最后登录时间'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '更新时间'
    }
  }, {
    tableName: 'user',
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Address, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });
    User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders', onDelete: 'CASCADE' });
    User.hasMany(models.Commission, { foreignKey: 'userId', as: 'commissions', onDelete: 'CASCADE' });
    User.hasMany(models.AfterSales, { foreignKey: 'userId', as: 'after_sales', onDelete: 'CASCADE' });
    User.hasMany(models.Invite, { foreignKey: 'inviteId', as: 'invitees', onDelete: 'CASCADE' });
    User.hasMany(models.Invite, { foreignKey: 'userId', as: 'invited_by', onDelete: 'CASCADE' });
    User.hasMany(User, { foreignKey: 'superiorId', as: 'subordinates' });
  };

  return User;
};
