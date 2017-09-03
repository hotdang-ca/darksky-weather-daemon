import axios from 'axios';
import assert from 'assert';
import Pusher from 'pusher';

/* We require these set in ENV. */
require('dotenv').config();
assert.notEqual(process.env.PUSHER, undefined, 'PUSHER should be true or false.');
if (process.env.PUSHER) {
  assert(process.env.PUSHER_APPID, 'PUSHER_APPID must be set.');
  assert(process.env.PUSHER_KEY, 'PUSHER_KEY must be set.');
  assert(process.env.PUSHER_SECRET, 'PUSHER_SECRET must be set.');
  assert(process.env.PUSHER_CLUSTER, 'PUSHER_CLUSER must be set.');
  assert(process.env.PUSHER_CHANNEL, 'PUSHER_CHANNEL must be set.');
  assert(process.env.PUSHER_EVENT, 'PUSHER_EVENT must be set.');
}

assert(process.env.DARKSKY_API_KEY, 'DarkSky API Key must exist.');
assert.notEqual(process.env.OMEGA2, undefined, 'OMEGA2 should be true or false.');

let pusher;
let output = '';
const UNITS = 'ca';
const FREQUENCY = 10; // in minutes
const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
const REGINA_COORDS = '50.450484,-104.651229';
const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
const API_URL = `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${REGINA_COORDS}?exclude=minutely,hourly,daily,alerts,flags&units=${UNITS}`;

const getWeather = () => {
  axios.get(API_URL).then((response) => {
    // console.log(response);

    const { data } = response;
    if (data) {
      const { currently } = data;

      if (currently) {
        const { summary, temperature, apparentTemperature, windSpeed, windGust, windBearing, time } = currently;
        const lastUpdate = new Date(time);
        output = `REGINA: It is currently ${parseInt(temperature, 10)}°C and ${summary}. Feels like ${parseInt(apparentTemperature, 10)}°C. Wind ${parseInt(windSpeed, 10)}km/h, gusting to ${parseInt(windGust, 10)}km/h from the ${degreesToCompass(windBearing)}. Updated ${lastUpdate.toLocaleTimeString()}\nPowered by DarkSky`;

        sendOutput(output, currently);
      }
    }
  });
};

const sendOutput = (output, raw) => {
  oledOutput(output); // go to OLED
  consoleOutput(output); // to the console
  pusherOutput(output, raw); // to go Pusher
}

const oledOutput = (output) => {
  if (process.env.OMEGA2 !== 'true') {
    return;
  }

  try {
    const oledExp = require('/usr/bin/node-oled-exp');
    oledExp.init();
    oledExp.clear();
    oledExp.setTextColumns();
    oledExp.setCursor(0, 0);
    oledExp.write(output);
  } catch (e) {
    console.log('Error with oled');
  }
}

const pusherOutput = (output, raw) => {
  if (process.env.PUSHER !== 'true') {
    return;
  }

  try {
    if (!pusher) {
      pusher = new Pusher({
        appId: process.env.PUSHER_APPID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: process.env.PUSHER_CLUSTER,
        encrypted: true,
      });
    }

    pusher.trigger(process.env.PUSHER_CHANNEL, process.env.PUSHER_EVENT, {
      message: output,
      ...raw,
    });
  } catch (e) {
    console.log('Error with pusher', e);
  }
}

const consoleOutput = (output) => {
  console.log(output);
}

const degreesToCompass = (deg) => {
  const directionalIndex = parseInt(((deg / 22.5) + 0.5), 10);
  return directions[directionalIndex];
}

setInterval(() => {
  getWeather();
}, FREQUENCY * 1000 * 60);

console.log('Starting weather daemon');
getWeather();
