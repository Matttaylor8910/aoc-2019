const fs = require('fs');
const {sortBy} = require('lodash');

const BLACK = '0';
const WHITE = '1';

/**
 * For the input, find the layer that contains the fewest 0 digits. 
 * Return the number of 1 digits multiplied by the number of 2 digits 
 * for that layer
 */
function part1(input, width, height) {
  const area = width * height;
  const counts = getLayerCounts(input, area);
  const sorted = sortBy(counts, '0');
  return sorted[0]['1'] * sorted[0]['2'];
}

/**
 * For the input, stack the layers from top down and return the image to 
 * reveal the message encoded in white pixels
 */
function part2(input, width, height) {
  const area = width * height;
  const layers = getLayers(input, area);
  const image = buildImage(layers, area);
  return fold(image, width).join('\n');
}

/**
 * Given an input and the area of the image, return an array containing 
 * the counts of each pixel occurrence for each layer
 */
function getLayerCounts(input, area) {
  const layers = [];
  for (const layer of getLayers(input, area)) {
    const map = {};
    for (let char of layer) {
      map[char] = (map[char] || 0) + 1;
    }
    layers.push(map);
  }
  return layers;
}

/**
 * Given an input and the area of the image, return an array of layers
 */
function getLayers(input, area) {
  const layers = [];
  for (let i = 0; i < input.length; i += area) {
    layers.push(input.slice(i, i + area));
  }
  return layers;
}

/**
 * Given an array of layers and the area of the image, stack the layers,
 * and return one image as a single layer where each pixel is the first
 * non-transparent pixel when looking top down
 */
function buildImage (layers, area) {
  let image = '';
  for (let i = 0; i < area; i++) {
    image += getPixel(layers, i);
  }
  return image;
}

/**
 * Given an array of layers and the index of the pixel to get, return the
 * first non-transparent pixel when looking top down
 */
function getPixel(layers, i) {
  for (const layer of layers) {
    switch (layer[i]) {
      case BLACK:
        return ' ';
      case WHITE:
        return '#';
      default:
        break;
    }
  }
  return '!'; // this should never happen
}

/**
 * Given a string input and the lineSize, recusively build up and return
 * a "folded" array, where each item in the array is the next section of 
 * the original string input of length lineSize
 */
function fold(input, lineSize, lineArray = []) {
  if (input.length <= lineSize) {
      lineArray.push(input);
      return lineArray;
  }
  lineArray.push(input.substring(0, lineSize));
  var tail = input.substring(lineSize);
  return fold(tail, lineSize, lineArray);
}

/**
 * Parse the input
 */
function parseInput() {
  return fs.readFileSync('day08/day08.txt', 'utf8');
}

// parse input and output answers
const input = parseInput();
const width = 25, height = 6;
console.log(part1(input, width, height));
console.log(part2(input, width, height));