const chalk = require('chalk');
const moment = require("moment");
const EventEmitter = require('events').EventEmitter;

exports.events = new EventEmitter();

function _getCallerFile() {
	var originalFunc = Error.prepareStackTrace;
	var callerfile;
	try {
			var err = new Error();
			var currentfile;
			Error.prepareStackTrace = function (err, stack) { return stack; };
			currentfile = err.stack.shift().getFileName();
			while (err.stack.length) {
					callerfile = err.stack.shift().getFileName();
					if(currentfile !== callerfile) break;
			}
	} catch (e) {}
	Error.prepareStackTrace = originalFunc; 
	callerfile = callerfile.split('/');
	return callerfile.slice(-1)[0];
}

// This returns a caller file from a stacktrace
function processStackTrace(stack) {
	return stack.split('\n').slice(1,2)[0].split('/').slice(-1);
}

exports.log_to_console = function(message, type, timestamp, caller) {
	timestamp = timestamp || moment();
  timestamp = moment(timestamp).format("HH:mm:ss");
	type = type || 'none';
	message = `${timestamp} - ${message}`;
	caller = caller || 'unknown';
	var caller = chalk.white(" (caller: " + caller +")");
	switch(type) {
		case "success":
		console.log(chalk.white.bgGreen(message) + caller);
		break;
		case "info":
		console.log(chalk.white.bgBlue(message) + caller);
		break;
		case "warning":
		console.log(chalk.white.bgYellow(message) + caller);
		break;
		case "error":
		console.log(chalk.white.bgRed(message) + caller);
		break;
		default:
		console.log(message + caller);
	}
}

exports.log = function(message, type, timestamp) {
	var caller = _getCallerFile();
	timestamp = timestamp || moment();

	exports.events.emit('log', {
		message,
		type,
		timestamp
	});
	
  exports.log_to_console(message, type, timestamp, caller);
}

// process.on('log', (message, type) => {
//   exports.log(message, type);
// });

module.exports = exports;