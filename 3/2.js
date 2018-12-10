const parsed = parse();
const notOverlapped = getNotOverLapped(parsed);

console.log(notOverlapped);

function parse() {
    const fs = require('fs');
    const contents = fs.readFileSync('data', 'utf8');
    const lines = contents.split('\n');
    return lines.map(l => ({
        id: +l.split('@')[0].substring(1, 1000),
        left: +parseGetPosition(l)[0],
        top: +parseGetPosition(l)[1],
        width: +parseGetSize(l)[0],
        height: +parseGetSize(l)[1]
    }));
}

function parseGetPosition(val) {
    return val.split('@')[1].split(':')[0].split(',');
}

function parseGetSize(val) {
    return val.split('@')[1].split(':')[1].split('x');
}

function getNotOverLapped(parsed) {
    let notOverlapped;
    let i = 0;
    while (!notOverlapped && i < parsed.length) {
        const overlapCount = parsed.filter(p => isOverlap(parsed[i], p)).length;
        if (overlapCount === 1) {   // only overlaps with self
            notOverlapped = parsed[i];
        }
        i++;
    }
    return notOverlapped;
}

function isOverlap(a, b) {
    return (a.left < right(b)) && (right(a) > b.left) && // overlap horizontal
        (a.top < bottom(b)) && (bottom(a) > b.top); // overlap vertical
}

function right(a) {
    return a.left + a.width;
}

function bottom(a) {
    return a.top + a.height;
}