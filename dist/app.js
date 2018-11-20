"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SlackInvite;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = require("body-parser");

var _http = require("http");

var _emailRegex = _interopRequireDefault(require("email-regex"));

var _cors = _interopRequireDefault(require("cors"));

var _superagent = _interopRequireDefault(require("superagent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SlackInvite(_ref) {
  var token = _ref.token,
      _ref$interval = _ref.interval,
      interval = _ref$interval === void 0 ? 5000 : _ref$interval,
      org = _ref.org,
      gcaptcha_secret = _ref.gcaptcha_secret,
      gcaptcha_sitekey = _ref.gcaptcha_sitekey,
      _ref$path = _ref.path,
      path = _ref$path === void 0 ? "/" : _ref$path,
      _ref$server = _ref.server,
      server = _ref$server === void 0 ? false : _ref$server;
  var app = (0, _express.default)();
  var assets = __dirname + '/assets';
  app.options('*', (0, _cors.default)());
  app.use((0, _cors.default)());
  app.get('/', function (req, res) {
    res.json({
      success: true
    });
  });
  return app;
}