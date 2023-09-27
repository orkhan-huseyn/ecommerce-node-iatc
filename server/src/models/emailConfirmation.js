const { DataTypes } = require('sequelize');
const sequelize = require('../database/index');

const EmailConfirmation = sequelize.define(
  'EmailConfirmation',
  {
    confirmationToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = EmailConfirmation;
