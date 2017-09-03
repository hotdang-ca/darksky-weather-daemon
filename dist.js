'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _pusher = require('pusher');

var _pusher2 = _interopRequireDefault(_pusher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* We require these set in ENV. */
require('dotenv').config();
_assert2.default.notEqual(process.env.PUSHER, undefined, 'PUSHER should be true or false.');
if (process.env.PUSHER) {
  (0, _assert2.default)(process.env.PUSHER_APPID, 'PUSHER_APPID must be set.');
  (0, _assert2.default)(process.env.PUSHER_KEY, 'PUSHER_KEY must be set.');
  (0, _assert2.default)(process.env.PUSHER_SECRET, 'PUSHER_SECRET must be set.');
  (0, _assert2.default)(process.env.PUSHER_CLUSTER, 'PUSHER_CLUSER must be set.');
  (0, _assert2.default)(process.env.PUSHER_CHANNEL, 'PUSHER_CHANNEL must be set.');
  (0, _assert2.default)(process.env.PUSHER_EVENT, 'PUSHER_EVENT must be set.');
}

(0, _assert2.default)(process.env.DARKSKY_API_KEY, 'DarkSky API Key must exist.');
_assert2.default.notEqual(process.env.OMEGA2, undefined, 'OMEGA2 should be true or false.');

var pusher = void 0;
var output = '';
var UNITS = 'ca';
var FREQUENCY = 10; // in minutes
var directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
var REGINA_COORDS = '50.450484,-104.651229';
var DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
var API_URL = 'https://api.darksky.net/forecast/' + DARKSKY_API_KEY + '/' + REGINA_COORDS + '?exclude=minutely,hourly,daily,alerts,flags&units=' + UNITS;

var getWeather = function getWeather() {
  _axios2.default.get(API_URL).then(function (response) {
    // console.log(response);

    var data = response.data;

    if (data) {
      var currently = data.currently;


      if (currently) {
        var summary = currently.summary,
            temperature = currently.temperature,
            apparentTemperature = currently.apparentTemperature,
            windSpeed = currently.windSpeed,
            windGust = currently.windGust,
            windBearing = currently.windBearing,
            time = currently.time;

        var lastUpdate = new Date(time);
        output = 'REGINA: It is currently ' + parseInt(temperature, 10) + '\xB0C and ' + summary + '. Feels like ' + parseInt(apparentTemperature, 10) + '\xB0C. Wind ' + parseInt(windSpeed, 10) + 'km/h, gusting to ' + parseInt(windGust, 10) + 'km/h from the ' + degreesToCompass(windBearing) + '. Updated ' + lastUpdate.toLocaleTimeString() + '\nPowered by DarkSky';

        sendOutput(output, currently);
      }
    }
  });
};

var sendOutput = function sendOutput(output, raw) {
  oledOutput(output); // go to OLED
  consoleOutput(output); // to the console
  pusherOutput(output, raw); // to go Pusher
};

var oledOutput = function oledOutput(output) {
  if (process.env.OMEGA2 !== 'true') {
    return;
  }

  try {
    var oledExp = require('/usr/bin/node-oled-exp');
    oledExp.init();
    oledExp.clear();
    oledExp.setTextColumns();
    oledExp.setCursor(0, 0);
    oledExp.write(output);
  } catch (e) {
    console.log('Error with oled');
  }
};

var pusherOutput = function pusherOutput(output, raw) {
  if (process.env.PUSHER !== 'true') {
    return;
  }

  try {
    if (!pusher) {
      pusher = new _pusher2.default({
        appId: process.env.PUSHER_APPID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: process.env.PUSHER_CLUSTER,
        encrypted: true
      });
    }

    pusher.trigger(process.env.PUSHER_CHANNEL, process.env.PUSHER_EVENT, _extends({
      message: output
    }, raw));
  } catch (e) {
    console.log('Error with pusher', e);
  }
};

var consoleOutput = function consoleOutput(output) {
  console.log(output);
};

var degreesToCompass = function degreesToCompass(deg) {
  var directionalIndex = parseInt(deg / 22.5 + 0.5, 10);
  return directions[directionalIndex];
};

setInterval(function () {
  getWeather();
}, FREQUENCY * 1000 * 60);

console.log('Starting weather daemon');
getWeather();
