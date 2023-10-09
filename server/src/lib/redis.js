const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_CONNECTION_URL,
  legacyMode: false,
});

redisClient
  .connect()
  .then(function () {
    console.log("Successfully connected to redis database.");
  })
  .catch(function (error) {
    console.log("Error connecting to redis: " + error.message);
  });

module.exports = redisClient;
