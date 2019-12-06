const fs = require('fs');
const {reverse} = require('lodash');

/**
 * Determine total number of direct and indirect orbits
 * (the sum of all the path lengths back to the root)
 */
function part1(input) {
  // for each key in the orbit map, count the path length
  const orbits = buildOrbitRelationships(input);
  return Object.keys(orbits)
    .map(key => getPathLength(orbits, key))
    .reduce((a, b) => a + b, 0);
}

/**
 * Determine the minimum number of orbital transfers required 
 * (the distance between YOU and SAN non-inclusive)
 */
function part2(input) {
  // fetch the paths from root to YOU and SAN
  const orbits = buildOrbitRelationships(input);
  const youPath = reverse(getPath(orbits, 'YOU'));
  const sanPath = reverse(getPath(orbits, 'SAN'));

  // search for when these two paths split, and add the remainders of the 
  // paths minus the two nodes themselves to get the distance between them
  for (let i = 0; i < youPath.length && i < sanPath.length; i++) {
    if (youPath[i] !== sanPath[i]) {
      return (youPath.length - i) + (sanPath.length - i) - 2;
    }
  }
}

/**
 * Build a map of each orbit relationship
 */
function buildOrbitRelationships(input) {
  const orbits = {};
  for (relationship of input) {
    orbits[relationship.child] = relationship.parent;
  }
  return orbits;
}

/**
 * Get the length of a path back to the root node
 */
function getPathLength(orbits, key) {
  return getPath(orbits, key).length;
}

/**
 * Get the full path from the root node to a given key
 */
function getPath(orbits, key) {
  if (orbits[key]) {
    return [key].concat(getPath(orbits, orbits[key]));
  } else {
    return [];
  }
}

/**
 * Parse the input into a {parent: string, child: string}[]
 */
function parseInput() {
  return fs.readFileSync('day06/day06.txt', 'utf8')
    .split('\n')
    .map(x => {
      const [parent, child] = x.split(')');
      return {parent, child};
    });
}

// parse input and output answers
var input = parseInput();
console.log(part1(input));
console.log(part2(input));