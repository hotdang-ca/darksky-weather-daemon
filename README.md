# Weather API
## About
The weather api polls DarkSky for weather details on coordinates, and displays to console.
When on an Omega2 or Omega2+ with OLED expansion, will also output to the OLED.

## Getting Started
You may have problems with `npm install` on a physical Omega2; current solution is to use the `npm run omega2` which will run the current `dist.js` file. Do a `npm install axios` first, which is the only REAL dependency, plus your OLED nodejs tools on the device. `okpg install node-oled-exp`.

## Environment Variables
You need a `DARKSKY_API_KEY` and, optionally, an `OMEGA2` key, which can be set to `true`, or any other value to ignore omega2 OLED functions. These should be in your ENV, eg, `export DARKSKY_API_KEY=yourapikeyhere`, and optionally, `export OMEGA2=true`.

## Author
James Perih <james@hotdang.ca>.

## LICENSE
Copyright 2017 James Robert Perih

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
