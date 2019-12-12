const fs = require('fs');
const {sortBy, chain, each} = require('lodash');

const DEBUG = false;

function part1(asteroids) {
  const counts = {};
  for (const asteroid of Object.values(asteroids)) {
    counts[getKey(asteroid)] = getCount(asteroid, asteroids);
    if (DEBUG) console.log(`${getKey(asteroid)}: ${counts[getKey(asteroid)]}`)
  }

  const sorted = chain(Object.entries(counts))
    .map(([key, count]) => {
      const [x, y] = key.split(',').map(val => parseInt(val));
      return {x, y, count};
    })
    .orderBy(['count'], ['desc'])
    .value();

  return sorted[0];
}

function part2(asteroids) {
  const startingLocation = part1(asteroids);
  const manhattan = getManhattanForAsteroid(startingLocation, asteroids);
  const grouped = chain(manhattan)
    .map(asteroid => {
      const {x, y, distance} = asteroid;
      const angle = getAngle(startingLocation, asteroid);
      return {x, y, distance, angle};
    })
    .groupBy('angle')
    .map((asteroidsAtThisAngle, key) => {
      return {
        angle: parseFloat(key),
        asteroids: sortBy(asteroidsAtThisAngle, 'distance')
      }
    })
    .sortBy('angle')
    .value()

  const target = 200;
  let removed = null;
  let index = 0;
  let count = 0;

  while (count < target) {
    const thisAngle = grouped[index % grouped.length];
    
    // if this angle has no remaining asteroids, just increment the index
    if (thisAngle.asteroids.length === 0) {
      index++;
      if (DEBUG) console.log(`index: ${index - 1}, angle: ${thisAngle.angle}, no asteroids, count: ${count}`);
    }

    // if there are asteroids, remove the first one at that angle
    else {
      if (DEBUG) console.log(`index: ${index}, angle: ${thisAngle.angle}`, thisAngle.asteroids);
      removed = thisAngle.asteroids.splice(0, 1);
      index++;
      count++;
      if (DEBUG) console.log(`removed: ${getKey(removed[0])}, count: ${count}`);
    }
  }

  // what do you get if you multiply its X coordinate by 100 and then add its Y coordinate? (For example, 8,2 becomes 802.)
  const {x, y} = removed[0];
  return (x * 100) + y;
}

function getCount(asteroid, asteroids) {
  const visited = {};
  const manhattan = getManhattanForAsteroid(asteroid, asteroids);
  let count = 0;
  if (DEBUG) console.log(asteroid, manhattan);

  while (manhattan.length > 0) {
    const next = manhattan.shift();
    const key = getKey(next);
    if (DEBUG) console.log(`looking at ${key}`)
    if (!visited[key]) {
      if (DEBUG) console.log(`incrementing the count for ${key}`)
      count++;
      visited[key] = true;
      removeObstructed(asteroid, next, manhattan);
    }
  }

  return count;
}

/**
 * Given a map of asteroids and one asteroid to start at, return a list 
 * of asteroids sorted by manhattan distance from the starting point
 */
function getManhattanForAsteroid(asteroid, asteroids) {
  const {x, y} = asteroid;
  return chain(Object.values(asteroids))
    .map(a => {
      return {
        x: a.x, 
        y: a.y, 
        distance: Math.abs(x - a.x) + Math.abs(y - a.y)
      };
    })
    .sortBy('distance')
    .filter(a => a.distance > 0)
    .value();
}

function removeObstructed(asteroid, next, asteroids) {
  let index = 0;
  while (index < asteroids.length) {
    const compared = asteroids[index];
    
    // if the three points are on the same line and in the same direction 
    // from the root asteroid the compared asteroid is obstructed
    if (onTheSameLine(asteroid, next, compared) && sameDirection(asteroid, next, compared)) {
      if (DEBUG) console.log(`${getKey(compared)} is obstructed by ${getKey(next)}... removing`)
      asteroids.splice(index, 1);
    }

    // if not obstructed, simply increment the index to keep searching
    else {
      index++;
    }
  }
}

function onTheSameLine(a, b, c) {
  return (a.y - b.y) * (a.x - c.x) === (a.x - b.x) * (a.y - c.y)
}

function sameDirection(a, b, c) {
  const bX = a.x - b.x, bY = a.y - b.y;
  const cX = a.x - c.x, cY = a.y - c.y;
  const xSameSign = (bX < 0 && cX < 0) || (bX >= 0 && cX >= 0);
  const ySameSign = (bY < 0 && cY < 0) || (bY >= 0 && cY >= 0);
  return xSameSign && ySameSign;
}

function getAngle(a, b) {
  const angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  const angleClockwiseFromNorth = (angle + 90 + 360) % 360;
  return angleClockwiseFromNorth;
}

function getKey(asteroid) {
  return `${asteroid.x},${asteroid.y}`;
}

/**
 * Parse the input
 */
function parseInput() {
  // read the rows as input
  const rows = fs.readFileSync('day10/day10.txt', 'utf8').split('\n')

  // build the map
  let asteroids = {};
  each(rows, (row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === '#') {
        const asteroid = {x, y};
        asteroids[getKey(asteroid)] = asteroid;
      }
    }
  });

  return asteroids;
}

// parse input and output answers
var asteroids = parseInput();
console.log(part1(asteroids));
console.log(part2(asteroids));


// TEST GET ANGLE
// console.log(getAngle({x: 5, y: 5}, {x: 5, y: 4}), 0)
// console.log(getAngle({x: 5, y: 5}, {x: 6, y: 4}), 45)
// console.log(getAngle({x: 5, y: 5}, {x: 6, y: 5}), 90)
// console.log(getAngle({x: 5, y: 5}, {x: 6, y: 6}), 135)
// console.log(getAngle({x: 5, y: 5}, {x: 5, y: 6}), 180)
// console.log(getAngle({x: 5, y: 5}, {x: 4, y: 6}), 225)
// console.log(getAngle({x: 5, y: 5}, {x: 4, y: 5}), 270)
// console.log(getAngle({x: 5, y: 5}, {x: 4, y: 4}), 315)