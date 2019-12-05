const {groupBy} = require('lodash');

function part1(low, high) {
  return findNumMatches(low, high, (i) => { 
    return neverDecrease(i) && hasAdjacentRepeats(i);
  });
}

function part2(low, high) {
  return findNumMatches(low, high, (i) => { 
    return neverDecrease(i) && hasDouble(i);
  });
}

/**
 * Return the number of integers between low and high (inlusive) that match 
 * the provided predicate
 */
function findNumMatches(low, high, predicate) {
  return Array.from({length: high - low}, (x,i) => i + low)
    .filter(predicate)
    .length;
}

/**
 * Return true if each digit from left to right is <= to the previous digit
 */
function neverDecrease(num) {
  const digits = String(num).split('').map(x => parseInt(x));
  let min;
  for (const digit of digits) {
    if (digit < min) return false;
    min = digit;
  }
  return true;
}

/**
 * Return true when any repeats are found in a number such as 11112 or 33 or 4445
 */
function hasAdjacentRepeats(num) {
  const digits = String(num).split('');
  const counts = Object.values(groupBy(digits))
    .map(x => x.length);
  return Math.max(...counts) >= 2;
}

/**
 * Return true when two adjacent matching digits are not part of a larger group 
 * of matching digits such as 122345 or 237789 or 11111133
 * 123444 or 111333 will be false because there is no double that is not part of 
 * a larger group of matching digits
 */
function hasDouble(num) {
  const digits = String(num).split('');
  return Object.values(groupBy(digits))
    .map(x => x.length)
    .includes(2);
}

// pass input and output answers
const low = 347312, high = 805915;
console.log(part1(low, high));
console.log(part2(low, high));