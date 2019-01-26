const rules = getInput();
const letters = getUniqueLettersOrdered(rules);
const permutations = getValidPermutation([], letters, rules);
console.log(permutations.join(''));

function getUniqueLettersOrdered(rules) {
  let result = [];
  for (const rule of rules) {
    result = addIfNotExist(result, rule.before);
    result = addIfNotExist(result, rule.after);
  }
  result.sort()
  return result;
}

function addIfNotExist(result, letter) {
  if (result.some(r => r === letter)) {
    return result;
  }
  return result.concat(letter);
}

function getValidPermutation(currentPermutation, remainingLetters, rules) {
  if (remainingLetters.length === 1) {
    if (isValidForRules(currentPermutation.concat(remainingLetters), rules, [])) {
      return currentPermutation.concat(remainingLetters);
    }
    return null;
  }
  for (let i = 0; i < remainingLetters.length; i++) {
    const newLetter = remainingLetters[i];
    const newRemainingLetters = remainingLetters.slice(0, i).concat(remainingLetters.slice(i + 1));
    const newPermutation = currentPermutation.concat(newLetter);
    if (isValidForRules(newPermutation, rules, newRemainingLetters)) {
      const result = getValidPermutation(newPermutation, newRemainingLetters, rules);
      if (result) {
        return result;
      }
    }
  };
}

function isValidForRules(sequence, rules, remaining) {
  // check all rules pass
  let isValid = true;
  for(let i = 0; i < rules.length && isValid; i++) {
    isValid &= isValidForRule(sequence, rules[i]);
  }
  if (!isValid) {
    return false;
  }
  // check if feasible:
  // find all rules with letter in sequence that is after part of rule
  //                and before part contains something in remaing
  const anyRules = rules.some(rule => sequence.some(s => s === rule.after) && remaining.some(r => r === rule.before));
  return !anyRules;
}

function isValidForRule(sequence, rule) {
  posBefore = sequence.indexOf(rule.before);
  posAfter = sequence.indexOf(rule.after);
  return posBefore < posAfter || posAfter === -1;
}

function getInput() {
  const fs = require('fs');
  const contents = fs.readFileSync('input', 'utf8');
  const lines = contents.split('\n');
  return lines.map(l=> ({
    before: l.split(' ')[1],
    after: l.split(' ')[7]
  }));
}
