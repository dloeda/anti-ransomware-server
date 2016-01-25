'use strict';

module.exports.processPost = function(req, res, callback) {
  var body = '';
  req.on('data', function(data) {
    body += data;
    // Too much POST data, kill the connection!
    if (body.length > 1e6) {
      req.connection.destroy();
    }
  });
  req.on('end', function() {
    req.body = JSON.parse(body);
    callback(req, res);
    res.status(200).send('OK');
  });
};