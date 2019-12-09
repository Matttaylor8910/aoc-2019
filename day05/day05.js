const fs = require('fs');
const { clone } = require('lodash');

const DEBUG = false;

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

/**
 * Given the initialInstructions, and an input, run the program and return 
 * the value at position 0 when the computer halts
 */
function runIntComputer(initialInstructions, input) {
  const instructions = clone(initialInstructions)
  let position = 0;

  if (DEBUG) console.log(`Instructions:\n${instructions.join(',')}\n`);
  
  while (position < instructions.length) {
    let operation = String(instructions[position]);
    
    // get the opcode as the furthest-most two digits and parse as a number
    // operation '1001' for example becomes '01' -> 1 -> ADD
    const opcode = parseInt(operation.slice(operation.length - 2));

    // handle HALT operation immediately
    if (opcode === HALT) {
      if (DEBUG) console.log('HALT');
      return instructions[0];
    } 
    
    // handle operations
    else if (opcode === ADD) {
      const pos1 = instructions[position + 1];
      const pos2 = instructions[position + 2];
      const savePos = instructions[position + 3];

      // based on modes for the parameters, get the values we should be using and add them
      const param1Val = getParamMode(operation, 0) === POSITION_MODE ? instructions[pos1] : pos1;
      const param2Val = getParamMode(operation, 1) === POSITION_MODE ? instructions[pos2] : pos2;
      const result = param1Val + param2Val;

      // wtf does the savePos do in immediate mode?
      instructions[savePos] = result;

      if (DEBUG) console.log(`${operation},${pos1},${pos2},${savePos} -> ${param1Val}+${param2Val}=${result} -> Store at ${savePos}`);
      if (DEBUG) console.log(instructions.join(','));

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

      // wtf does the savePos do in immediate mode?
      instructions[savePos] = result;

      if (DEBUG) console.log(`${operation},${pos1},${pos2},${savePos} -> ${param1Val}+${param2Val}=${result} -> Store at ${savePos}`);
      if (DEBUG) console.log(instructions.join(','));

      // 1 opcode, 3 params
      position += 4;
    } 
    
    else if (opcode === SAVE) {
      // can this opcode even do immediate mode? The instructions say to save at the address 
      // provided by the first parameter, but if the first param is let's say 5, in imediate 
      // mode, what do we do with 5?
      const pos = instructions[position + 1];
      instructions[pos] = input;

      if (DEBUG) console.log(`${operation},${pos} -> Store ${input} at ${pos}`);
      if (DEBUG) console.log(instructions.join(','));

      // 1 opcode, 1 param
      position += 2;
    } 
    
    else if (opcode === OUTPUT) {
      const pos1 = instructions[position + 1];
      const param1Val = getParamMode(operation, 0) === POSITION_MODE ? instructions[pos1] : pos1;
      console.log(`\n${operation},${pos1} - > OUTPUT: ${param1Val}\n`);

      // 1 opcode, 1 param
      position += 2;
    } 
    
    else if (opcode === JUMP_IF_TRUE) {
      const pos1 = instructions[position + 1];
      const pos2 = instructions[position + 2];

      const param1Val = getParamMode(operation, 0) === POSITION_MODE ? instructions[pos1] : pos1;
      const param2Val = getParamMode(operation, 1) === POSITION_MODE ? instructions[pos2] : pos2;

      if (DEBUG) console.log(`${operation},${pos1},${pos2} -> ${param1Val} ${param1Val === 0 ? '===' : '!=='} 0`);

      // Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction 
      // pointer to the value from the second parameter. Otherwise, it does nothing.
      if (param1Val !== 0) {
        position = param2Val;
        if (DEBUG) console.log(`Jump to ${position}`);
      } else {
        // 1 opcode, 2 params
        position += 3;
        if (DEBUG) console.log(`Do nothing`);
      }

      if (DEBUG) console.log(instructions.join(','));
    }

    else if (opcode === JUMP_IF_FALSE) {
      const pos1 = instructions[position + 1];
      const pos2 = instructions[position + 2];

      const param1Val = getParamMode(operation, 0) === POSITION_MODE ? instructions[pos1] : pos1;
      const param2Val = getParamMode(operation, 1) === POSITION_MODE ? instructions[pos2] : pos2;

      if (DEBUG) console.log(`${operation},${pos1},${pos2} -> ${param1Val} ${param1Val === 0 ? '===' : '!=='} 0`);

      // Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction 
      // pointer to the value from the second parameter. Otherwise, it does nothing.
      if (param1Val === 0) {
        position = param2Val;
        if (DEBUG) console.log(`Jump to ${position}`);
      } else {
        // 1 opcode, 2 params
        position += 3;
        if (DEBUG) console.log(`Do nothing`);
      }

      if (DEBUG) console.log(instructions.join(','));
    }

    else if (opcode === LESS_THAN) {
      const pos1 = instructions[position + 1];
      const pos2 = instructions[position + 2];
      const savePos = instructions[position + 3];

      // based on modes for the parameters, get the values we should be using and multiply them
      const param1Val = getParamMode(operation, 0) === POSITION_MODE ? instructions[pos1] : pos1;
      const param2Val = getParamMode(operation, 1) === POSITION_MODE ? instructions[pos2] : pos2;
      const result = param1Val < param2Val ? 1 : 0;

      // wtf does the savePos do in immediate mode? 
      instructions[savePos] = result;

      if (DEBUG) console.log(`${operation},${pos1},${pos2},${savePos} -> ${param1Val} ${result === 1 ? '<' : '>='} ${param2Val} -> result: ${result} -> Store at ${savePos}`);
      if (DEBUG) console.log(instructions.join(','));

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

      // wtf does the savePos do in immediate mode?
      instructions[savePos] = result;

      if (DEBUG) console.log(`${operation},${pos1},${pos2},${savePos} -> ${param1Val} ${result === 1 ? '===' : '!=='} ${param2Val} -> result: ${result} -> Store at ${savePos}`);
      if (DEBUG) console.log(instructions.join(','));

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
var instructions = parseInput();
console.log('PART 1:')
runIntComputer(instructions, 1);
console.log('PART 2:')
runIntComputer(instructions, 5);