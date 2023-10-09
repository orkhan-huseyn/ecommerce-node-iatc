const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

sequelize
  .authenticate()
  .then(function () {
    console.log("Connected to db successfully!");
  })
  .catch(function (error) {
    console.log("Error connecting db: " + error.message);
  });

module.exports = sequelize;
