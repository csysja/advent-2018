const parsed = parse();
const maxHeight = getMaxHeight(parsed);
const maxWidth = getMaxWidth(parsed);
const overlapped = getOverLapped(parsed, maxWidth, maxHeight);

console.log(parsed);
console.log(`${maxWidth}-${maxHeight}`);
console.log(overlapped.length);

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

function getMaxWidth(claims) {
    return claims.map(c => c.left + c.width)
        .sort((a, b) => b - a)[0];
}

function getMaxHeight(claims) {
    return claims.map(c => c.top + c.height)
        .sort((a, b) => b - a)[0];
}

function getOverLapped(parsed, maxWidth, maxHeight) {
    let overlapped = [];
    for(let x = 0; x < maxWidth; x++) {
        for (let y = 0; y < maxHeight; y++) {
            const overlapCount = parsed.filter(p => ((x >= p.left) && (x < p.left + p.width)) && 
                ((y >= p.top) && (y < p.top + p.height)))
                .length;
            if (overlapCount > 1) {
                overlapped.push({x: x, y: y});
            }
        }
    }
    return overlapped;
}
