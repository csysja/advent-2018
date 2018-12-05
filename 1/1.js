const fs = require('fs');
 
const contents = fs.readFileSync('data', 'utf8');
const lines = contents.split('\n');

let sum = 0;

for (const line of lines) {
  let num = +line;
  sum += num;
}
console.log(sum);