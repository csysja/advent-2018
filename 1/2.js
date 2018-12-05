const fs = require('fs');
 
const contents = fs.readFileSync('data', 'utf8');
const lines = contents.split('\n');

let frenquency = 0;
const frequecies = [];
let duplicate;
let i = 0;

do {
  let num = +lines[i];
  frenquency += num;
  duplicate = frequecies.find(f => f === frenquency);
  frequecies.push(frenquency);  
  if (i < lines.length - 1) {
    i++;
  } else {
    i = 0;
  }
} while (duplicate === undefined);

console.log(duplicate);