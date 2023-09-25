const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../database/index');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    stockCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    condition: {
      type: DataTypes.ENUM('NEW', 'USED', 'REFURBISHED'),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Product;
