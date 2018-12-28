const input = getInput();
const locationsClosestCoord = getLocationsClosestCoord(input);
// console.log('grid...');
// drawGrid(input, locationsClosestCoord);
// console.log();
const areaCount = getAreaCount(locationsClosestCoord);
const finiteArea = areaCount.filter(a => isFinite(a.coord, input));
console.log('finite area count...');
console.log(finiteArea);
console.log();
console.log(`Part 1: ${finiteArea[0].count}`);

function isFinite(coord, coords) {
  return coords.some(c => coord.x < c.x && coord.y > c.y) // somthing top right of it
    && coords.some(c => coord.x < c.x && coord.y < c.y) // somthing bottom right of it
    && coords.some(c => coord.x > c.x && coord.y > c.y) // somthing top left of it
    && coords.some(c => coord.x > c.x && coord.y < c.y) // somthing bottom left of it
}

function getAreaCount() {
  return locationsClosestCoord
    .reduce((a, b) => {
      if (b.closestCoord === null) {
        return a;
      }
      let item = a.find(i => i.coord.x === b.closestCoord.x && i.coord.y === b.closestCoord.y);
      if (item) {
        item.count++;
        return a;
      }
      item = {
        coord: b.closestCoord,
        count: 1,
      }
      return a.concat(item);
    }, [])
    .sort((a, b) => b.count - a.count);
}

function getLocationsClosestCoord(input) {
  const grid = getMinMaxArea(input);
  let result = [];
  for(let y = grid.min.y; y <= grid.max.y; y++) {  
    for(let x = grid.min.x; x <= grid.max.x; x++) {
      const position = {
        x: x,
        y: y
      };
      result.push({
        position: position,
        closestCoord: getClosestCoord(position, input),
      });
    }
  }
  return result;
}

function drawGrid(input, locationsClosestCoord) {
  let line = '';
  const grid = getMinMaxArea(input);  
  for(let location of locationsClosestCoord) {
    if (location.closestCoord === null) {
      line += '.';
    } else if (input.some(i => i.x === location.position.x && i.y === location.position.y)) {
      line += location.closestCoord.id.toUpperCase();
    } else {
      line += location.closestCoord.id;
    }
    if (location.position.x === grid.max.x) {
      console.log(line);
      line = '';
    }
  }
}

function getClosestCoord(position, input) {
  const locationByDistance = input.map(i => ({
      coord: i,
      distance: getManhattanDistance(i, position),
    }))
    .sort((a, b) => a.distance - b.distance)
  if (locationByDistance[0].distance === locationByDistance[1].distance) {
    return null;
  }
  return locationByDistance[0].coord;
}

function getManhattanDistance(coord1, coord2) {
  return Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y);
}

function getMinMaxArea(input) {
  return {
    min: {
      x: Math.min(...input.map(i => i.x)),
      y: Math.min(...input.map(i => i.y))
    },
    max: {
      x: Math.max(...input.map(i => i.x)),
      y: Math.max(...input.map(i => i.y))
    }
  };
}

function getInput() {
  const fs = require('fs');
  const contents = fs.readFileSync('input', 'utf8');
  const lines = contents.split('\n');
  const ids = "abcdefghijklmnopqstuvwxyz".split('');
  return lines.map((l, i) => ({
    x: +l.split(',')[0],
    y: +l.split(',')[1],
    id: ids[i],
  }));
}
