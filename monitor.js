const data = [];

const dataWidth = 100;
const intervalTime = 3000;
const endpoints = [
    "http://192.168.178.1/css/rd/images/fritzLogo.svg",
    "https://www.heise.de/icons/ho/heise_online_logo_top.gif"
];

class Transformation {
    constructor(length) {
        this.domainSpace = {
            x: length,
            y: 500
        };
        
        this.displaySpace = {
            x: 800,
            y: 400,
            margin: 50
        };
    }

    update(length, maxValue) {
        this.domainSpace.x = length;
        this.domainSpace.y = maxValue;
    }
        
    translate(point) {
        const x = point.x / this.domainSpace.x * this.displaySpace.x + this.displaySpace.margin;
        const y = (1 - (point.y / this.domainSpace.y)) * this.displaySpace.y + this.displaySpace.margin;
        return {x, y};
    }
}

class Polygone {
    constructor() {
        this.points = []
        this.svgContext = document.getElementsByTagName('svg')[0];
        this.svgNamespace = this.svgContext.namespaceURI;
    };
    
    clear() {
        for(let child of this.svgContext.children) {
            this.svgContext.removeChild(child);
        }
    }

    add(point) {
        this.points.push(point);
    }

    render() {
        const line = this.points
            .map(({x, y}) => `${x},${y}`)
            .join(' ');

        const poly = document.createElementNS(this.svgNamespace, 'polygon');
        poly.setAttribute('points', line);
        this.svgContext.appendChild(poly);
        return `<polygon points="${line}" />`;
    }
}

const transform = new Transformation(data.length);

function drawData() {
    const poly = new Polygone();
    poly.clear();

    function drawLine(index, start, stop, step) {
        for(let k=start; stop(k); k = step(k)) {
            let entry = data[k];
            let point = {
                x: k,
                y: entry[index]
            }
            poly.add(transform.translate(point));
        }
    }

    drawLine(0, 0, x => x < data.length, x => x+1);
    drawLine(1, data.length - 1, x => x >= 0, x => x-1);
    
    poly.render();
}

async function measureHttpRequest(url) {
    console.log(`measure ${url}`);
    const startMark = `${url}#start`;
    const endMark = `${url}#end`;
    const measureName = `${url}#measure`;
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.mark(startMark);
    const res = await fetch(url, {mode: 'no-cors'});
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    const measure = performance.getEntriesByName(measureName);
    const duration = measure[0].duration;
    performance.clearMeasures(measureName);
    return duration;
}

function getMaxValue() {
    let max = 0;
    for(let index=0; index<endpoints.length; index++) {
        const row = data.map(p => p[index]);
        const localMax = Math.max(...data.map(p => p[index]));
        max = Math.max(max, localMax);
    }
    return max;
}

async function measure() {
    if (data.length > dataWidth) {
        data.shift();
    }
    const entry = [0, 0];
    for(let index=0; index < endpoints.length; index++) {
        const url = endpoints[index];
        const duration = await measureHttpRequest(url);
        entry[index] = duration;
    }
    data.push(entry);
    const max = getMaxValue(data) + 50;
    transform.update(data.length, max);
    drawData();
}

setInterval(measure, intervalTime);
