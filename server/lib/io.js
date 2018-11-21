const io = require('socket.io')();
const db = require('./db');
const logging = require('./logging');

// New log entry created on server
// Send to clients and persist in DB
logging.events.on('log', (newentry) => {
  io.emit("server_log", newentry);
  db.get('log')
    .push(newentry)
    .write();
});

io.on('connection', function (socket) {
  socket.on('setCounter', function(counter) {
    db.assign( {counter: counter} ).write();
  });

  socket.on('sendstate', () => {
    // What do we send to the client on connection
    var state = {
      counter: db.get('counter'),
      log: db.get('log').takeRight(50)
    };

    socket.emit("state", state);
  });

  // New log entry created on client
  // Display in console and persist in DB
  socket.on('client_log', (newentry) => {
    logging.log_to_console(
      newentry.message,
      newentry.type,
      newentry.timestamp,
      'client'
    );
    db.get('log')
      .push(newentry)
      .write();
  });
});

module.exports = io;