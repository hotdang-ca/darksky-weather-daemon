import axios from 'axios';
import assert from 'assert';

const REGINA_COORDS = '50.450484,-104.651229';

assert(process.env.DARKSKY_API_KEY, 'DarkSky API Key must exist.');
const API_KEY = process.env.DARKSKY_API_KEY;

const UNITS = 'ca';
const FREQUENCY = 2; // in minutes
const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

const API_URL = `https://api.darksky.net/forecast/${API_KEY}/${REGINA_COORDS}?exclude=minutely,hourly,daily,alerts,flags&units=${UNITS}`;

let output = '';

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

        sendOutput(output);
      }
    }
  });
};

const sendOutput = (output) => {
  // to the console.
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
