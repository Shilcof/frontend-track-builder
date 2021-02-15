class Segment {
    constructor({segment_type, position}) {
        this.segmentType = segment_type;
        this.position = position;
    }

    static newSegments(segmentArray) {
        return segmentArray.map(segment => new Segment(segment))
    }

    draw() {
        if (canvas.getContext) {
            let [x, y] = posToCoordinates(this.position)
            const type = this.segmentType;
            // Draw the track type
            if (type < 2) {
                ctx.fillRect(x, y+20, 60, 20);
                if (type === 0) {
                    ctx.fillStyle = "white";
                    for (let i = 0; i < 5; i++) {
                        ctx.fillRect(x+26+(i%2)*4, y+20+i*4, 4, 4);
                    }
                    ctx.fillStyle = "black";
                }
            } else if (type === 2) {
                ctx.fillRect(x+20, y, 20, 60);
            } else {
                const adjuster = type - 10;
                const [xOffset, yOffset] = [(adjuster%2), (Math.floor(adjuster/2))]
                x += xOffset*60;
                y += yOffset*60;
    
                ctx.beginPath();
                const radius = 30; // Arc radius
                const startAngle = Math.PI / 2 * xOffset * ((-1)**yOffset); // Starting point on circle
                const endAngle = Math.PI / 2 * (xOffset + 1) * ((-1)**yOffset); // End point on circle
                const anticlockwise = yOffset === 1; // clockwise or anticlockwise
    
                ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
                ctx.lineWidth = 20;
                ctx.stroke();
            }
        }

    }
}

function posToCoordinates(position) {
    return [(position % 9)*60-1, (Math.floor(position/9))*60-1]
}