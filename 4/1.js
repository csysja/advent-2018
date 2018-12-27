const ActionEnum = Object.freeze({"start":1, "sleep":2, "wake":3})

const parsed = parse();
console.log(parsed);

function parse() {
    const fs = require('fs');
    const contents = fs.readFileSync('test', 'utf8');
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
            action = ActionEnum.start;
            break;
        case 'falls':
            action = ActionEnum.sleep;
            break; 
        case 'wakes':
            action = ActionEnum.wake;
            break;     
    }
    let guard = null;
    if (action === ActionEnum.start) {
        guard = actionparts[2];
    }
    return {
        action: action,
        guard: guard
    };
}
