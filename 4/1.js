const START = 'start';
const SLEEP = 'sleep';
const WAKE = 'wake';

const parsed = parse();
const ordered = parsed.sort(byDate);
const guardTimes = getGuardTimes(ordered);
const guardSleepMinutes = guardTimes
    .map(g => ({
        guard: g.guard,
        sleepingMinutes: g.sleeps.reduce((a, b) => a + (b.to - b.from), 0)
    }))
    .sort((a, b) => b.sleepingMinutes - a.sleepingMinutes);
const sleepiestGuard = guardTimes.find(g => g.guard === guardSleepMinutes[0].guard);

const sleepMinutes = sleepiestGuard.sleeps
    .map(s => createArrayRange(s.from, s.to))
    .reduce((a, b) => a.concat(b), [])
    .reduce((a, b) => { 
        if (a.some(m => m.minute === b)) {
            a.find(m => m.minute === b).count++;
            return a;
        } 
        return a.concat({ minute: b, count: 1 });
    }, [])
    .sort((a, b) => b.count - a.count);

const guardNumber = +sleepiestGuard.guard.replace('#', '');
console.log(sleepMinutes[0].minute * guardNumber);

function createArrayRange(from, to) {
    let result = [];
    for (let i = from; i < to; i++) {
        result.push(i);
    }
    return result;
}

function getGuardTimes(ordered) {
    let result = [];
    let current = null;
    let wakeStart = null;
    let sleepStart = null;
    let currentState = null;
    for(item of ordered) {
        if (item.action.action === START) {
            if (currentState === SLEEP) {
                current.sleeps.push({ from: sleepStart, to: 60});
            }
            if (currentState === WAKE) {
                current.wakes.push({ from: wakeStart, to: 60});
            }            
            if (result.some(i => i.guard === item.action.guard)) {
                current = result.find(i => i.guard === item.action.guard);
            } else {
                current = { guard: item.action.guard, sleeps: [], wakes: [] };
                result.push(current);
            }
            wakeStart = item.date.hour !== 0 ? 0 : item.date.minute;
        } else if (item.action.action === SLEEP) {
            current.wakes.push({ from: wakeStart, to: item.date.minute});
            sleepStart = item.date.minute;
            currentState = SLEEP;
        } else if (item.action.action === WAKE) {
            current.sleeps.push({ from: sleepStart, to: item.date.minute});
            wakeStart = item.date.minute;
            currentState = WAKE;            
        }
    }
    return result;
}

function byDate(entry1, entry2) {
    let result = entry1.date.year - entry2.date.year;
    if (result === 0) {
        result = entry1.date.month - entry2.date.month;
    }
    if (result === 0) {
        result = entry1.date.day - entry2.date.day;
    }
    if (result === 0) {
        result = entry1.date.hour - entry2.date.hour;
    }
    if (result === 0) {
        result = entry1.date.minute - entry2.date.minute;
    }
    return result;
}

function parse() {
    const fs = require('fs');
    const contents = fs.readFileSync('input', 'utf8');
    const lines = contents.split('\n');
    return lines.map(l => parseLine(l));
}

function parseLine(line) {
    const dateSplit = line.split(']');
    const datetime = dateSplit[0].substring(1);
    const dateparts = datetime.split(' ')[0].split('-');
    const timeparts = datetime.split(' ')[1].split(':');
    const date = {
        year: +dateparts[0],
        month: +dateparts[1],
        day: +dateparts[2],
        hour: +timeparts[0],
        minute: +timeparts[1]
    };
    const actionparts = dateSplit[1].split(' ');
    return {
        date: date,
        action: parseAction(actionparts)
    };
}

function parseAction(actionparts) {
    let action;
    switch (actionparts[1]) {
        case 'Guard':
            action = START;
            break;
        case 'falls':
            action = SLEEP;
            break; 
        case 'wakes':
            action = WAKE;
            break;     
    }
    let guard = null;
    if (action === START) {
        guard = actionparts[2];
    }
    return {
        action: action,
        guard: guard
    };
}
