"use strict";

var _app = _interopRequireDefault(require("./lib/app"));

var _awsServerlessExpress = _interopRequireDefault(require("aws-serverless-express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.init = function (event, context) {
  var options = {
    subdomain: process.env.SLACK_SUBDOMAIN,
    token: process.env.SLACK_API_TOKEN,
    gcaptcha_secret: process.env.GOOGLE_CAPTCHA_SECRET,
    gcaptcha_sitekey: process.env.GOOGLE_CAPTCHA_SITEKEY,
    path: process.env.BASE_PATH || '/'
  };
  var app = (0, _app.default)(options);

  var server = _awsServerlessExpress.default.createServer(app);

  _awsServerlessExpress.default.proxy(server, event, context);
};