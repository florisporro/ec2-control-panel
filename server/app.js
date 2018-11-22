const io = require("./lib/io");
const db = require('./lib/db');
const ec2 = require('./lib/ec2');

let app = {};

const Instance = new ec2({
  AWS_REGION: process.env.AWS_REGION,
  AWS_INSTANCE_ID: process.env.AWS_INSTANCE_ID,
  AWS_INSTANCETYPE_SMALL: process.env.AWS_INSTANCETYPE_SMALL,
  AWS_INSTANCETYPE_LARGE: process.env.AWS_INSTANCETYPE_LARGE
});

Instance.on('status', status => io.sockets.emit('instanceStatus', status));
Instance.on('instanceTypeStatus', status => io.sockets.emit('instanceTypeStatus', status));

io.on('connection', (socket) => {
  socket.on('getStatus', () => Instance.getStatus());
  socket.on('startInstance', () => Instance.startInstance());
  socket.on('stopInstance', () => Instance.stopInstance());
  socket.on('rebootInstance', () => Instance.rebootInstance());
  socket.on('changeInstanceType', (type) => Instance.changeInstanceType(type));
});
