const data = [
    [7, 105],
    [8, 113],
    [9, 112],
    [8, 104]
]

class Transformation {
    constructor() {
        this.domainSpace = {
            x: 4,
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

const transform = new Transformation();

for(let entry of data) {
    let point = {
        x: entry[0],
        y: entry[1]
    };
    let displayPoint = transform.translate(point);
    console.log(displayPoint);
}