"use strict";

var _app = _interopRequireDefault(require("./lib/app"));

var _http = require("http");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hostname = process.env.HOSTNAME || '0.0.0.0';
var port = process.env.PORT || 3000;
var options = {
  subdomain: process.env.SLACK_SUBDOMAIN,
  token: process.env.SLACK_API_TOKEN,
  gcaptcha_secret: process.env.GOOGLE_CAPTCHA_SECRET,
  gcaptcha_sitekey: process.env.GOOGLE_CAPTCHA_SITEKEY,
  path: process.env.BASE_PATH || '/'
};
var app = (0, _app.default)(options);
var srv = (0, _http.Server)(app);
srv.app = app;
srv.listen(port, hostname, function (err) {
  if (err) throw err;
  console.log('%s – listening on %s:%d', new Date(), hostname, port);
});