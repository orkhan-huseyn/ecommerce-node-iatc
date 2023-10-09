const { DataTypes } = require("sequelize");
const sequelize = require("../database/index");

const ProductImage = sequelize.define(
  "ProductImage",
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = ProductImage;
