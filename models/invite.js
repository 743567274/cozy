// models/invite.js
// 邀请表模型
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Invite = sequelize.define('Invite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户id',
    },
    inviteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '邀请人id',
    },
    inviteTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '邀请时间',
    },
  }, {
    tableName: 'invite',
    timestamps: true,
  });

  Invite.associate = (models) => {
    // 被邀请的人
    Invite.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    // 邀请人
    Invite.belongsTo(models.User, {
      foreignKey: 'inviteId',
      as: 'inviter',
    });
  };

  return Invite;
};
