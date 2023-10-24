require("dotenv").config();

const http = require("http");

const app = require("./src/app");

const httpServer = http.createServer(app);

httpServer.listen(8080, function () {
  console.log("HTTP server is running on port 8080!");
});

// this is just a test