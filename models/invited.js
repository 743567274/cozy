'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invited extends Model {
    static associate(models) {
      // Invited 属于一个用户（被邀请人）
      Invited.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // Invited 也可以有一个上级用户（邀请人）
      Invited.belongsTo(models.User, {
        foreignKey: 'superiorId',
        as: 'superior'
      });
    }
  }

  Invited.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: '用户id'
    },
    superiorId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: '上级id'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Invited',
    tableName: 'invited',
    timestamps: false,
    underscored: true
  });

  return Invited;
};
