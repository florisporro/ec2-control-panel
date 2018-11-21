const express = require('express');
const	router = express.Router();
const Mustache = require('mustache');
const fs = require('fs');

router.get('/', function (req, res) {
  var template = fs.readFile('./server/views/index.html', 'utf8', function (err, data) {
    res.send(Mustache.render(data, {
      hello: 'world'
    }));
  });
});

module.exports = router;

