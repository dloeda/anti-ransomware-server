'use strict';

var request = require('request'),
  cheerio = require('cheerio'),
  io = require('./io'),
  url = 'http://apk-dl.com/',
  prefix = 'http:';


function downloadWeb(url, callback) {
  request(url, function(error, response, body) {
    callback(!error && body);
  });
}

function downloadAPK(url, name, err, callback) {
  request(url).on('error', err)
    .on('response', function(res) {
      res.pipe(io.saveStream('./' + name + '.apk')).on('finish', callback);
    });
}


function searchLinkPage(url, selector, attr, callback) {
  downloadWeb(url, function(body) {
    var link = cheerio.load(body)(selector),
      href = link && link.attr(attr);
    callback(href && href.trim());
  });
}

module.exports = function(pkgName, err, callback) {
  searchLinkPage(url + pkgName, 'a.download', 'href', function(href) {
    searchLinkPage(prefix + href, '.contents>meta', 'content', function(href) {
      var apkref = href.match(/http(.*)\.apk/);
      downloadAPK(apkref[0], pkgName, err, callback);
    });
  });
};