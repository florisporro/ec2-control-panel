const express = require('express');
const	router = express.Router();
const Mustache = require('mustache');
const fs = require('fs');

router.get('/', function (req, res) {
  var template = fs.readFile('./server/views/index.html', 'utf8', function (err, data) {
    res.send(Mustache.render(data, {
      toolName: process.env.TOOLNAME || 'Amazon EC2 Instance Controller',
      instanceName: process.env.INSTANCENAME || 'Amazon EC2 Instance',
      smallType: process.env.AWS_INSTANCETYPE_SMALL || 't3.nano',
      largeType: process.env.AWS_INSTANCETYPE_LARGE || 't3.2xlarge'
    }));
  });
});

module.exports = router;

