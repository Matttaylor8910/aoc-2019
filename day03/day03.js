const fs = require('fs');
const {chain} = require('lodash');

function part1(wires) {
  const map = {};
  for (let i = 0; i < wires.length; i++) {
    addWireToMap(map, wires[i], i);
  }

  const distances = chain(Object.entries(map))
    .map(([key, value]) => {
      return {key, value};
    })
    .filter(x => x.value.length === 2)
    .filter(x => x.key !== '0_0')
    .map(val => {
      const [x, y] = val.key.split('_').map(x => Math.abs(parseInt(x)));
      return x + y;
    })
    .value();

  console.log(distances);
  return Math.min(...distances);
}

function part2(wires) {
  const map = {};
  for (let i = 0; i < wires.length; i++) {
    addWireToMap(map, wires[i], i);
  }

  const steps = chain(Object.entries(map))
    .map(([key, value]) => {
      return {key, value};
    })
    .filter(x => x.value.length === 2)
    .filter(x => x.key !== '0_0')
    .map(x => {
      return x.value.map(x => x.steps).reduce((a, b) => a + b, 0);
    })
    .value();

  console.log(steps);
  return Math.min(...steps);
}

function addWireToMap(map, wire, wireNum) {
  let x = 0, y = 0;
  let steps = 0;
  for (const instruction of wire) {
    if (instruction) {
      const direction = instruction.slice(0, 1);
      const amount = parseInt(instruction.slice(1));
      const prevX = x, prevY = y;
  
      // console.log(`instruction: ${instruction}, direction: ${direction}, amount: ${amount}, x: ${x}, y: ${y}`);

      // handle 4 directions
      if (direction === 'U') {
        y -= amount;
        for (let i = y; i <= prevY; i++) {
          incrementPosition(map, x, i, wireNum, steps + i);
        }
      }
      else if (direction === 'R') {
        x += amount;
        for (let i = prevX; i <= x; i++) {
          incrementPosition(map, i, y, wireNum, steps + i);
        }
      }
      else if (direction === 'D') {
        y += amount;
        for (let i = prevY; i <= y; i++) {
          incrementPosition(map, x, i, wireNum, steps + i);
        }
      }
      else if (direction === 'L') {
        x -= amount;
        for (let i = x; i <= prevX; i++) {
          incrementPosition(map, i, y, wireNum, steps + i);
        }
      }
      else console.log('ERROR');

      // always increment steps
      steps += amount;

      // console.log(map);
    }
  }
}

function incrementPosition(map, x, y, wireNum, steps) {
  const val = map[`${x}_${y}`];
  const toSave = {wireNum, steps};
  if (val) {
    // don't allow visiting a second time because we only care about minimum # of steps
    const visited = val.map(x => x.wireNum).includes(wireNum);
    if (!visited) {
      map[`${x}_${y}`] = val.concat(toSave);
    }
  }
  else {
    map[`${x}_${y}`] = [toSave];
  }
  // console.log(val, map[`${x}_${y}`])
}

/**
 * Parse the input into a number[]
 */
function parseInput() {
  return fs.readFileSync('day03/test2.txt', 'utf8')
    .split('\n')
    .map(x => {
      return x.split(',');
    });
}

// parse input and output answers
var input = parseInput();
console.log(part1(input));
console.log(part2(input));