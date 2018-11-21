"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SlackInvite;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _http = require("http");

var _emailRegex = _interopRequireDefault(require("email-regex"));

var _cors = _interopRequireDefault(require("cors"));

var _superagent = _interopRequireDefault(require("superagent"));

var _path = _interopRequireDefault(require("path"));

var _badge = _interopRequireDefault(require("./badge"));

var _slack = _interopRequireDefault(require("./slack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SlackInvite(_ref) {
  var token = _ref.token,
      _ref$interval = _ref.interval,
      interval = _ref$interval === void 0 ? 5000 : _ref$interval,
      subdomain = _ref.subdomain,
      gcaptcha_secret = _ref.gcaptcha_secret,
      gcaptcha_sitekey = _ref.gcaptcha_sitekey,
      _ref$server = _ref.server,
      server = _ref$server === void 0 ? false : _ref$server;
  var app = (0, _express.default)();
  app.use('/assets', _express.default.static(_path.default.join(__dirname, 'assets')));
  app.use(_bodyParser.default.json({
    strict: false
  }));
  var assets = __dirname + '/assets';
  var slack = new _slack.default({
    token: token,
    subdomain: subdomain
  });
  app.options('*', (0, _cors.default)());
  app.use((0, _cors.default)());
  app.get('/', function (req, res) {
    res.json({
      success: true
    });
  });
  app.post('/invite', function (req, res) {
    var email = req.body.email;

    if (!email) {
      return res.status(400).json({
        msg: 'No email provided'
      });
    }

    if (!(0, _emailRegex.default)().test(email)) {
      return res.status(400).json({
        msg: 'Invalid email'
      });
    }

    slack.invite({
      email: email
    }).then(function () {
      res.json({
        success: true
      });
    }).catch(function (err) {
      res.status(401).json({
        success: false,
        message: err.message
      });
    });
  });
  app.get('/stats', function (req, res) {
    slack.getUsersStats({}).then(function (stats) {
      res.json({
        success: true,
        stats: stats
      });
    }).catch(function (err) {
      res.status(401).json({
        success: false,
        message: err.message
      });
    });
  });
  app.get('/badge.svg', function (req, res) {
    res.type('svg');
    res.set('Cache-Control', 'max-age=0, no-cache');
    res.set('Pragma', 'no-cache');
    slack.getUsersStats({}).then(function (stats) {
      res.send((0, _badge.default)(stats).toHTML());
    }).catch(function (err) {
      res.send((0, _badge.default)({
        active: 0,
        total: 0
      }).toHTML());
    });
  });
  return app;
}