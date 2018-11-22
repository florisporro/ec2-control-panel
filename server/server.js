require('dotenv').config();

const path = require('path');
const settings = require('./settings');

// Express and server init
const express = require('express');
const app = express()
const server = require('http').Server(app);
server.listen(3000);

// Comms
var io = require("./lib/io");
io.attach(server);

// Router setup
app.use('/', require('./lib/routes.js'));

// How to serve the client js
if (process.env.NODE_ENV === 'development') {
  // Compile webpack on the fly
  console.log("Starting in dev mode");
  require('./util/webpack-dev-middleware').init(app);
} else {
  // Serve static distributable client files
  app.use('/dist', express.static('./client/dist'))
}

// Setup logger
const logging = require('./lib/logging');
logging.log("Server started", "success");

require("./app");