require('dotenv').config();

const fs = require('fs');
const http = require('http');
const https = require('https');

const app = require('./src/app');

const httpServer = http.createServer(app);
const httpsServer = https.createServer(
  {
    cert: fs.readFileSync('cert/cert.pem'),
    key: fs.readFileSync('cert/key.pem'),
  },
  app
);

httpServer.listen(8080, function () {
  console.log('HTTP server is running on port 8080!');
});

httpsServer.listen(8083, function () {
  console.log('HTTPS server is running on port 8083!');
});
