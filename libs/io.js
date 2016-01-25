'use strict';

var fs = require('fs');

module.exports.load = function(path, opts) {
  var data;
  try {
    if (opts.format === 'raw') {
      data = fs.readFileSync(path);
    } else {
      data = JSON.parse(fs.readFileSync(path + '.json'));
    }
  } catch (e) {
    data = null;
  }
  return data;
};

module.exports.save = function(path, data, opts) {
  if (opts.format === 'raw') {
    fs.writeFile(path, data);
  } else {
    fs.writeFile(path + '.json', JSON.stringify(data));
  }
};

module.exports.saveStream = function(path) {
  return fs.createWriteStream(path);
};