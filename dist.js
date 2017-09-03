'use strict';

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_assert2.default.notEqual(process.env.OMEGA2, undefined, 'OMEGA2 should be true or false.');

var REGINA_COORDS = '50.450484,-104.651229';

(0, _assert2.default)(process.env.DARKSKY_API_KEY, 'DarkSky API Key must exist.');
var API_KEY = process.env.DARKSKY_API_KEY;

var UNITS = 'ca';
var FREQUENCY = 2; // in minutes
var directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

var API_URL = 'https://api.darksky.net/forecast/' + API_KEY + '/' + REGINA_COORDS + '?exclude=minutely,hourly,daily,alerts,flags&units=' + UNITS;

var output = '';

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

        sendOutput(output);
      }
    }
  });
};

var sendOutput = function sendOutput(output) {
  oled(output); // go to OLED
  consolelog(output); // to the console
};

var oled = function oled(output) {
  if (process.env.OMEGA2 !== 'true') {
    return;
  }

  try {
    var oledExp = require('/usr/bin/node-oled-exp');
    oledExp.init();
    oledExp.setTextColumns();
    oledExp.setCursor(0, 0);
    oledExp.write(output);
  } catch (e) {
    console.log('Error with oled');
  }
};

var consolelog = function consolelog(output) {
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
