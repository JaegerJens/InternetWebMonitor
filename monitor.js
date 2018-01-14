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

for(let index=0; index < data.length; index++) {
    let entry = data[index];
    let point = {
        x: index,
        y: entry[0]
    };
    poly.add(transform.translate(point));
}

for(let index=(data.length-1); index >= 0; index--) {
    let entry = data[index];
    let point = {
        x: index,
        y: entry[1]
    };
    poly.add(transform.translate(point));
}
console.log(poly.render());