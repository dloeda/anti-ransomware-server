'use strict';

var gcm = require('node-gcm');
var _ = require('underscore');

var io = require('./io');
var constants = require('./constants');

var _config;

var _sender;

function addAppsToDB(appsAdded) {
  var apps = io.load(_config['apps-folder'] + 'apps') || [];
  var appsIds = _.pluck(appsAdded, 'id');
  var newApps = appsIds.diff(apps);

  console.log('--appsAdded ' + JSON.stringify(appsAdded));
  console.log('--appsIds ' + JSON.stringify(appsIds));
  console.log('--newApps ' + JSON.stringify(newApps));

  for (var i = 0; i < newApps.length; i++) {
    var app = _.findWhere(appsAdded, {
      id: newApps[i]
    });
    app.status = constants.pending;
    io.save(_config['apps-folder'] + newApps[i], app);
  }

  console.log(apps.concat(newApps));
  io.save(_config['apps-folder'] + 'apps', apps.concat(newApps));
}

function checkApps(body) {
  var appsIds = _.pluck(body.appsAdded, 'id');
  var data = {
    info: []
  };
  for (var i = 0; i < appsIds.length; i++) {
    var app = io.load(_config['apps-folder'] + appsIds[i]) || {};
    if (app.status !== constants.pending && app.status !== constants.safe) {
      data.code = app.status;
      data.info.push(appsIds);
    }
  }
}

function addInformation(info, body) {
  console.log(JSON.stringify(body));
  if (body.appsAdded) {
    if (!info.apps) {
      info.apps = [];
    }
    addAppsToDB(body.appsAdded);
    info.apps = _.uniq(info.apps.concat(_.pluck(body.appsAdded, 'id')));
  }
  if (body.appsRemoved) {
    info.apps = _.without(info.apps, body.appsRemoved);
  }
}

function sendNotification(data, ids) {
  var message = new gcm.Message();

  message.addNotification(data.notification);
  message.addData(data.data);
  message.timeToLive = data.ttl || 3000;

  _sender.send(message, ids);
}

/* Exports */
module.exports.init = function init(config) {
  _config = config;
  _sender = new gcm.Sender(_config['push-server-key']);
};


module.exports.processToken = function processToken(req) {
  var id = req.body.id;
  var token = req.body.token;

  var clientInfo = io.load(_config['clients-folder'] + id) || {
    id: id
  };
  clientInfo.token = token;
  io.save(_config['clients-folder'] + id, clientInfo);

  sendNotification({
    notification: {
      title: 'Ransomware Analyzer',
      body: 'Initilization Completed',
      icon: 'ic_launcher'
    }
  }, [token]);
};

module.exports.processInfo = function processInfo(req) {
  var id = req.body.id;

  var clientInfo = io.load(_config['clients-folder'] + id) || {
    id: id
  };
  addInformation(clientInfo, req.body);
  io.save(_config['clients-folder'] + id, clientInfo);
  var data = checkApps(req.body);

  sendNotification({
    data: data
  }, [clientInfo.token]);
};