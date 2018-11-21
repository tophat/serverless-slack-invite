"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _superagent = _interopRequireDefault(require("superagent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Slack =
/*#__PURE__*/
function () {
  function Slack(_ref) {
    var token = _ref.token,
        interval = _ref.interval,
        subdomain = _ref.subdomain;

    _classCallCheck(this, Slack);

    this.channelsByName = {};
    this.org = {};
    this.subdomain = subdomain;
    this.token = token;
    this.users = {};
  }

  _createClass(Slack, [{
    key: "invite",
    value: function invite(_ref2) {
      var _this = this;

      var email = _ref2.email,
          channel = _ref2.channel;
      return new Promise(function (resolve, reject) {
        var data = {
          email: email,
          token: _this.token
        };

        if (channel) {
          data.channels = channel;
          data.ultra_restricted = 1;
          data.set_active = true;
        }

        _superagent.default.post("https://".concat(_this.subdomain, ".slack.com/api/users.admin.invite")).type('form').send(data).end(function (err, res) {
          if (err) return reject(err);

          if (200 != res.status) {
            reject(new Error("Invalid response ".concat(res.status, ".")));
            return;
          } // If the account that owns the token is not admin, Slack will oddly
          // return `200 OK`, and provide other information in the body. So we
          // need to check for the correct account scope and call the callback
          // with an error if it's not high enough.


          var _res$body = res.body,
              ok = _res$body.ok,
              providedError = _res$body.error,
              needed = _res$body.needed;

          if (!ok) {
            if (providedError === 'missing_scope' && needed === 'admin') {
              reject(new Error("Missing admin scope: The token you provided is for an account that is not an admin. You must provide a token from an admin account in order to invite users through the Slack API."));
            } else if (providedError === 'already_invited') {
              reject(new Error('You have already been invited to Slack. Check for an email from feedback@slack.com.'));
            } else if (providedError === 'already_in_team') {
              reject(new Error("Sending you to Slack..."));
            } else {
              reject(new Error(providedError));
            }

            return;
          }

          resolve();
        });
      });
    }
  }, {
    key: "getUsers",
    value: function getUsers() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _superagent.default.get("https://".concat(_this2.subdomain, ".slack.com/api/users.list")).query({
          token: _this2.token,
          presence: 1
        }).end(function (err, res) {
          if (err) return reject(err);
          if (!res.body.members || !res.body.members.length) reject(new Error("Invalid Slack response: ".concat(res.status)));
          resolve(res.body.members);
        });
      });
    }
  }, {
    key: "getUsersStats",
    value: function getUsersStats() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.getUsers().then(function (users) {
          if (!users || users && !users.length) {
            reject(new Error("Invalid Slack response: ".concat(res.status)));
          } // remove slackbot and bots from users
          // slackbot is not a bot, go figure!


          users = users.filter(function (x) {
            return x.id != 'USLACKBOT' && !x.is_bot && !x.deleted;
          });
          var total = users.length;
          var active = users.filter(function (user) {
            return 'active' === user.presence;
          }).length;
          resolve({
            total: total,
            active: active
          });
        }).catch(reject);
      });
    }
  }]);

  return Slack;
}();

exports.default = Slack;