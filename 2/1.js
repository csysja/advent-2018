const fs = require('fs');
 
const contents = fs.readFileSync('data', 'utf8');
const lines = contents.split('\n');

let twos = 0;
let threes = 0;

for (const line of lines) {
  const counts = getCounts(line.split(''));
  if (counts.some(c => c.count === 2)) {
    twos++;
  }
  if (counts.some(c => c.count === 3)) {
    threes++;
  }
}

console.log(twos * threes);

function getCounts(ids) {
  return ids.reduce((a, c) => {
    const item = a.find(l => l.letter === c);
    if (item === undefined) {
      a.push({
        letter: c,
        count: 1
      });
    } else {
      item.count++;
    }
    return a;
  }, []);
}