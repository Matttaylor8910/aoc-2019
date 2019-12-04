const fs = require('fs');

function part1(wires) {
  const map = {};
  for (let i = 0; i < wires.length; i++) {
    addWireToMap(map, wires[i], i);
  }

  const distances = Object.entries(map)
    .filter(([key, value]) => key !== '0_0' && value.length === 2)
    .map(([key]) => key.split('_').map(x => Math.abs(parseInt(x))).reduce((a, b) => a + b, 0));

  return Math.min(...distances);
}

function part2(wires) {
  const map = {};
  for (let i = 0; i < wires.length; i++) {
    addWireToMap(map, wires[i], i);
  }

  const steps = Object.entries(map)
    .filter(([key, value]) => key !== '0_0' && value.length === 2)
    .map(([key, value]) => value.map(x => x.steps).reduce((a, b) => a + b, 0));

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

      // handle 4 directions
      if (direction === 'U') {
        y -= amount;
        for (let i = prevY; i > y; i--) {
          incrementPosition(map, x, i, wireNum, steps++);
        }
      }
      else if (direction === 'R') {
        x += amount;
        for (let i = prevX; i < x; i++) {
          incrementPosition(map, i, y, wireNum, steps++);
        }
      }
      else if (direction === 'D') {
        y += amount;
        for (let i = prevY; i < y; i++) {
          incrementPosition(map, x, i, wireNum, steps++);
        }
      }
      else if (direction === 'L') {
        x -= amount;
        for (let i = prevX; i > x; i--) {
          incrementPosition(map, i, y, wireNum, steps++);
        }
      }
      else console.log('ERROR');
    }
  }
}

function incrementPosition(map, x, y, wireNum, steps) {
  const position = map[`${x}_${y}`];
  const toSave = {wireNum, steps};
  if (position) {
    // don't allow visiting a second time because we only care about minimum # of steps
    const visited = position.map(x => x.wireNum).includes(wireNum);
    if (!visited) {
      map[`${x}_${y}`] = position.concat(toSave);
    }
  }
  else {
    map[`${x}_${y}`] = [toSave];
  }
}

/**
 * Parse the input into a number[]
 */
function parseInput() {
  return fs.readFileSync('day03/day03.txt', 'utf8')
    .split('\n')
    .map(x => {
      return x.split(',');
    });
}

// parse input and output answers
var input = parseInput();
console.log(part1(input));
console.log(part2(input));