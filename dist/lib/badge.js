"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = badge;

var _vd = _interopRequireDefault(require("vd"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var title = 'slack';
var color = '#E01563';
var pad = 8; // left / right padding

var sep = 4; // middle separation

function badge(_ref) {
  var total = _ref.total,
      active = _ref.active;
  var value = active ? "".concat(active, "/").concat(total) : '' + total || '–';
  var lw = pad + width(title) + sep; // left side width

  var rw = sep + width(value) + pad; // right side width

  var tw = lw + rw; // total width

  return (0, _vd.default)("svg xmlns=\"http://www.w3.org/2000/svg\" width=".concat(tw, " height=20"), (0, _vd.default)("rect rx=3 width=".concat(tw, " height=20 fill=#555")), (0, _vd.default)("rect rx=3 x=".concat(lw, " width=").concat(rw, " height=20 fill=").concat(color)), (0, _vd.default)("path d=\"M".concat(lw, " 0h").concat(sep, "v20h-").concat(sep, "z\" fill=").concat(color)), (0, _vd.default)('g text-anchor=middle font-family=Verdana font-size=11', text({
    str: title,
    x: Math.round(lw / 2),
    y: 14
  }), text({
    str: value,
    x: lw + Math.round(rw / 2),
    y: 14
  })));
} // generate text with 1px shadow


function text(_ref2) {
  var str = _ref2.str,
      x = _ref2.x,
      y = _ref2.y;
  return [(0, _vd.default)("text fill=#010101 fill-opacity=.3 x=".concat(x, " y=").concat(y + 1), str), (0, _vd.default)("text fill=#fff x=".concat(x, " y=").concat(y), str)];
} // π=3


function width(str) {
  return 7 * str.length;
}