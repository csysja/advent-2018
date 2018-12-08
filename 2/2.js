const fs = require('fs');
 
const contents = fs.readFileSync('data', 'utf8');
const lines = contents.split('\n').map(l => l.replace('\r', ''));

let solution = null;
let currentWordIndex = 0;
let compareWordIndex = 1;
while (!solution) {
    const matchingLetters = getMatchingLetters(lines[currentWordIndex], lines[compareWordIndex]);
    if (matchingLetters.length === 25) {
        solution = matchingLetters; // found match
    } else if (compareWordIndex === lines.length - 1 && currentWordIndex === lines.length - 2) {
        solution = 'failed to find';    // reached the end without finding
    } else if (compareWordIndex === lines.length - 1) {
        currentWordIndex++; // current word has been compare with all other words
        compareWordIndex = currentWordIndex + 1;
    } else {
        compareWordIndex++; // find next word to compare to current word
    }
}

console.log(solution.join(''));

function getMatchingLetters(word1, word2) {
    result = [];
    for(let i = 0; i < word1.length; i++) {
        if (word1[i] === word2[i]) {
            result.push(word1[i]);
        }
    }
    return result;
}

