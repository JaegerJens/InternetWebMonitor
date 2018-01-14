const data = [
    [7, 105],
    [8, 113],
    [9, 112],
    [8, 104]
]

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
        
    translate(point) {
        const x = point.x / this.domainSpace.x * this.displaySpace.x + this.displaySpace.margin;
        const y = (1 - (point.y / this.domainSpace.y)) * this.displaySpace.y + this.displaySpace.margin;
        return {x, y};
    }
}

class Polygone {
    constructor() {
        this.points = []
    };

    add(point) {
        this.points.push(point);
    }

    render() {
        const line = this.points
            .map(({x, y}) => `${x},${y}`)
            .join(' ');
        return `<polygon points="${line}" />`;
    }
}

const transform = new Transformation(data.length);
const poly = new Polygone();


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

console.log(poly.render());