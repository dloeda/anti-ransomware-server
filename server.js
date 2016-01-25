'use strict';

require('./utils');

var push = require('./libs/push');
var parser = require('./libs/parser');
var analyzer = require('./libs/analyze');
var config = require('./config/config');
var express = require('express');

analyzer.init(config.analyze);
analyzer.analyze();

var app = express();

push.init(config.push);

app.post('/token', function(req, res) {
  console.log('token');
  parser.processPost(req, res, push.processToken);
});

app.post('/info', function(req, res) {
  console.log('info');
  parser.processPost(req, res, push.processInfo);
});

app.listen(process.env.PORT, process.env.IP);