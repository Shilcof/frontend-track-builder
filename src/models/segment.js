const segmentList = document.getElementById('segment-list');

class Segment {
    constructor({segment_type, position}) {
        this.segmentType = segment_type;
        this.position = position;
    }

    static segmentTypes = [1, 2, 10, 11, 12, 13];

    static newSegments(segmentArray) {
        return segmentArray ? segmentArray.map(segment => new Segment(segment)) : []
    }

    static buildSegmentCanvasses() {
        for (const segmentType of this.segmentTypes) {
            const segment = new Segment({segment_type: segmentType, position: 0})
            const segmentCanvas = document.createElement('canvas');
            segmentCanvas.width = 60;
            segmentCanvas.height = 60;
            segmentCanvas.classList.add('segmentCanvas');
            segmentCanvas.dataset['id'] = segmentType;
            segment.draw(segmentCanvas)
            segmentList.append(segmentCanvas)
        }
    }

    draw(canvas) {
        if (canvas.getContext) {
            console.log(this.segmentType)
            const ctx = canvas.getContext('2d');
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
                ctx.lineWidth = 1;
            }
        }

    }
}

function posToCoordinates(position) {
    return [(position % 9)*60-1, (Math.floor(position/9))*60-1]
}