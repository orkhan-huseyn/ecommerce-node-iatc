const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../database/index');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    emailConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'BLOCKED', 'BANNED'),
      defaultValue: 'ACTIVE',
    },
  },
  {
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'users_email_index',
        using: 'BTREE',
        fields: ['email'],
      },
    ],
  }
);

module.exports = User;
