const fs = require('fs');
const { add } = require('../util');

/**
 * Given a list of masses as number[], return the total fuel required
 */
function part1(masses) {
  return masses
    .map(mass => getFuel(mass))
    .reduce((a, b) => add(a, b), 0);
}

/**
 * Given a list of masses as number[], return the total fuel required
 * This time, fuel requires fuel, and so on recursively/iteratively
 */
function part2(masses) {
  return masses
    .map(mass => getTotalFuel(mass))
    .reduce((a, b) => add(a, b), 0);
}

/**
 * Given mass as a number, return the amount of fuel required
 */
function getFuel(mass) {
  return Math.floor(mass / 3) - 2;
}

/**
 * Given mass as a number, return the amount of fuel required
 * Do this iteratively calculating the total fuel needed including
 * the fuel needed for the mass of the fuel
 */
function getTotalFuel(mass) {
  let totalFuel = 0;

  while (mass > 0) {
    const fuel = getFuel(mass);
    if (fuel > 0) {
      totalFuel = add(fuel, totalFuel);
    }
    mass = parseInt(fuel);
  }

  return totalFuel;
}

/**
 * Parse the input into a number[]
 */
function parseInput() {
  return fs.readFileSync('day01/day01.txt', 'utf8')
    .split('\n')
    .map(x => parseInt(x));
}

// parse input and output answers
var input = parseInput();
console.log(part1(input));
console.log(part2(input));