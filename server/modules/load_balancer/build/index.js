'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var express_1 = __importDefault(require('express'));
var dotenv_1 = __importDefault(require('dotenv'));
var axios_1 = __importDefault(require('axios'));
var helpers_1 = require('./helpers');
var coordinator_1 = require('./routes/coordinator');
dotenv_1.default.config();
var app = express_1.default();
var coordinatorUrl = process.env.COORDINATOR_URL_ROOT || 'http://localhost:3000';
var hostname = process.env.HOST || 'localhost';
var port = helpers_1.getPort();
process.env.URL_ROOT = 'http://' + hostname + ':' + port;
app.use(express_1.default.json());
// LOCAL STUFF
var servicesList = ['url_shortener'];
////////////
// ROUTES //
////////////
// GET HOMEPAGE ROUTE
app.use(coordinator_1.router);
app.post('/serviceupdate', function(req, res) {
  var activeServices = req.body;
  console.log(activeServices);
  servicesList.forEach(function(service) {});
  res.send(req.body);
});
var serviceData = {
  name: process.env.SERVICE_NAME || 'load_balancer',
  url: process.env.URL_ROOT || 'http://' + hostname + ':' + port,
};
var server = app.listen(port, hostname, function() {
  console.log('Running server on port ' + port);
  try {
    axios_1.default.post(coordinatorUrl + '/startnotification/', serviceData);
  } catch (err) {
    console.log('uh oh');
    console.log(err);
  }
});
var exitSignals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
helpers_1.exitGracefullyOnSignals(exitSignals, server, coordinatorUrl, serviceData);
//# sourceMappingURL=index.js.map
