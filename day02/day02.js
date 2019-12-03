const fs = require('fs');
const { clone } = require('lodash');

const HALT = 99;
const ADD = 1;
const MULT = 2;

/**
 * Given a list of numbers, run the program and return position 0
 */
function part1(input) {
  return getPosition0(input, 12, 2);
}

/**
 * Given a list of numbers, run the program and searching for the 
 * verb and noun that make position 0 the desiredOutput. Return the
 * result of 100 * noun + verb
 */
function part2(initialInput) {
  const input = clone(initialInput);
  const desiredOutput = 19690720;

  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      const clonedInput = clone(input);
      if (getPosition0(clonedInput, noun, verb) === desiredOutput) {
        return 100 * noun + verb;
      }
    }
  }

  return `DESIRED OUTPUT NEVER MET: ${desiredOutput}`;
}

/**
 * Given the input, a noun and a verb, run the program and return 
 * the value at position 0 when the computer halts
 */
function getPosition0(initialInput, noun, verb) {
  const input = clone(initialInput)
  input[1] = noun;
  input[2] = verb;
  
  for (let i = 0; i < input.length; i += 4) {
    // handle HALT operation immediately
    let operation = input[i];
    if (operation === HALT) {
      return input[0];
    } 

    // parse positions to operate on as well as the savePos
    const pos1 = input[i + 1], 
          pos2 = input[i + 2],
          savePos = input[i + 3];
    
    // handle operations
    if (operation === ADD) {
      input[savePos] = input[pos1] + input[pos2];
    } else if (operation === MULT) {
      input[savePos] = input[pos1] * input[pos2];
    }
  }
}

/**
 * Parse the input into a number[]
 */
function parseInput() {
  return fs.readFileSync('day02/day02.txt', 'utf8')
    .split(',')
    .map(x => parseInt(x));
}

// parse input and output answers
var input = parseInput();
console.log(part1(input));
console.log(part2(input));