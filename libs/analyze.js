'use strict';

var download = require('./download'),
  virustotal = require('virustotal.js');

module.exports.init = function(config) {
  virustotal.setKey(config['virus-server-key']);
};

module.exports.analyze = function() {
  download('com.hcg.cok.gp', function() {
    console.log('err');
  }, function() {
    virustotal.scanFile('./com.hcg.cok.gp.apk', function(err, res) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(res);
    });
  });
};