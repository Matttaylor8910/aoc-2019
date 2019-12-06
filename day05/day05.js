const fs = require('fs');
const { clone } = require('lodash');

const HALT = 99;
const ADD = 1;
const MULT = 2;
const SAVE = 3;
const OUTPUT = 4;
const JUMP_IF_TRUE = 5;
const JUMP_IF_FALSE = 6;
const LESS_THAN = 7;
const EQUALS = 8;

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;

function part1(instructions) {
  getPosition0(instructions, 1);
}

function part2(instructions) {
  getPosition0(instructions, 5);
}

/**
 * Given the initialInstructions, and an input, run the program and return 
 * the value at position 0 when the computer halts
 */
function getPosition0(initialInstructions, input) {
  const instructions = clone(initialInstructions)
  let position = 0;
  
  while (position < instructions.length) {
    let operation = String(instructions[position]);
    
    // get the opcode as the furthest-most two digits and parse as a number
    // operation '1001' for example becomes '01' -> 1 -> ADD
    const opcode = parseInt(operation.slice(operation.length - 2));

    console.log(`operation: ${operation}, opcode: ${opcode}`);

    // handle HALT operation immediately
    if (opcode === HALT) {
      return instructions[0];
    } 
    
    // handle operations
    if (opcode === ADD) {
      const pos1 = instructions[position + 1];
      const pos2 = instructions[position + 2];
      const savePos = instructions[position + 3];

      // based on modes for the parameters, get the values we should be using and add them
      const param1Val = getParamMode(operation, 0) === POSITION_MODE ? instructions[pos1] : pos1;
      const param2Val = getParamMode(operation, 1) === POSITION_MODE ? instructions[pos2] : pos2;
      const result = param1Val + param2Val;

      // wtf does the savePos do in immediate mode? doing the same thing here
      getParamMode(operation, 2) === POSITION_MODE ? instructions[savePos] = result : instructions[savePos] = result;

      // 1 opcode, 3 params
      position += 4;
    } 
    
    else if (opcode === MULT) {
      const pos1 = instructions[position + 1];
      const pos2 = instructions[position + 2];
      const savePos = instructions[position + 3];

      // based on modes for the parameters, get the values we should be using and multiply them
      const param1Val = getParamMode(operation, 0) === POSITION_MODE ? instructions[pos1] : pos1;
      const param2Val = getParamMode(operation, 1) === POSITION_MODE ? instructions[pos2] : pos2;
      const result = param1Val * param2Val;

      // wtf does the savePos do in immediate mode? doing the same thing here
      getParamMode(operation, 2) === POSITION_MODE ? instructions[savePos] = result : instructions[savePos] = result;

      // 1 opcode, 3 params
      position += 4;
    } 
    
    else if (opcode === SAVE) {
      // can this opcode even do immediate mode? The instructions say to save at the address 
      // provided by the first parameter, but if the first param is let's say 5, in imediate 
      // mode, what do we do with 5?
      const pos = instructions[position + 1];
      instructions[pos] = input;

      // 1 opcode, 1 param
      position += 2;
    } 
    
    else if (opcode === OUTPUT) {
      const pos = instructions[position + 1];
      console.log(`OUTPUT: ${instructions[pos]}`);

      // 1 opcode, 1 param
      position += 2;
    } 
    
    else if (opcode === JUMP_IF_TRUE) {
      const pos1 = instructions[position + 1];
      const pos2 = instructions[position + 1];

      const param1Val = getParamMode(operation, 0) === POSITION_MODE ? instructions[pos1] : pos1;
      const param2Val = getParamMode(operation, 1) === POSITION_MODE ? instructions[pos2] : pos2;

      if (param1Val !== 0) {
        position = param2Val;
      } else {
        // 1 opcode, 2 params
        position += 3;
      }
    }

    else if (opcode === JUMP_IF_FALSE) {
      const pos1 = instructions[position + 1];
      const pos2 = instructions[position + 1];

      const param1Val = getParamMode(operation, 0) === POSITION_MODE ? instructions[pos1] : pos1;
      const param2Val = getParamMode(operation, 1) === POSITION_MODE ? instructions[pos2] : pos2;

      if (param1Val == 0) {
        position = param2Val;
      } else {
        // 1 opcode, 2 params
        position += 3;
      }
    }

    else if (opcode === LESS_THAN) {
      const pos1 = instructions[position + 1];
      const pos2 = instructions[position + 2];
      const savePos = instructions[position + 3];

      // based on modes for the parameters, get the values we should be using and multiply them
      const param1Val = getParamMode(operation, 0) === POSITION_MODE ? instructions[pos1] : pos1;
      const param2Val = getParamMode(operation, 1) === POSITION_MODE ? instructions[pos2] : pos2;
      const result = param1Val < param2Val ? 1 : 0;

      // wtf does the savePos do in immediate mode? doing the same thing here
      getParamMode(operation, 2) === POSITION_MODE ? instructions[savePos] = result : instructions[savePos] = result;

      // 1 opcode, 3 params
      position += 4;
    }

    else if (opcode === EQUALS) {
      const pos1 = instructions[position + 1];
      const pos2 = instructions[position + 2];
      const savePos = instructions[position + 3];

      // based on modes for the parameters, get the values we should be using and multiply them
      const param1Val = getParamMode(operation, 0) === POSITION_MODE ? instructions[pos1] : pos1;
      const param2Val = getParamMode(operation, 1) === POSITION_MODE ? instructions[pos2] : pos2;
      const result = param1Val === param2Val ? 1 : 0;

      // wtf does the savePos do in immediate mode? doing the same thing here
      getParamMode(operation, 2) === POSITION_MODE ? instructions[savePos] = result : instructions[savePos] = result;

      // 1 opcode, 3 params
      position += 4;
    }
  }
}

/**
 * Given an instruction like '1001', find the mode depending on the index 
 * of the parameter we're on. We work backwards from right to left. For this 
 * example, given a paramIndex of 0 (the first parameter) we need to return 
 * 0 as the mode, which is the first character from right to left after the 2 
 * digit opcode. paramIndex of 1 would return 1, which is the second character
 * from right to left after the opcode. Any paramIndex greater than that would 
 * be out of bounds, and would inherently return 0
 */
function getParamMode(operation, paramIndex) {
  // 3 and 2 are the offsets we need to get the first character (R to L) after 
  // the opcode, subtract the paramIndex additionally to get future modes
  const start = operation.length - 3 - paramIndex;
  const end = operation.length - 2 - paramIndex;
  return parseInt(operation.slice(start, end) || '0');
}

/**
 * Parse the input into a number[]
 */
function parseInput() {
  return fs.readFileSync('day05/day05.txt', 'utf8')
    .split(',')
    .map(x => parseInt(x));
}

// parse input and output answers
var input = parseInput();
console.log(part1(input));
console.log(part2(input));