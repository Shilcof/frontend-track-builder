const canvas = document.getElementById('track-display');
const ctx = canvas.getContext('2d');

function drawSegment(type, position) {
    if (canvas.getContext) {
        [x, y] = posToCoordinates(position)
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
            adjuster = type - 10;
            x += (adjuster%2)*60;
            y += (Math.floor(adjuster/2))*60;

            if (adjuster === 2) {
                adjuster = 3;
            }   else if (adjuster === 3) {
                adjuster =2;
            }

            ctx.beginPath();
            const radius = 30; // Arc radius
            const startAngle = Math.PI / 2 * adjuster; // Starting point on circle
            const endAngle = Math.PI / 2 * (adjuster + 1); // End point on circle
            const anticlockwise = false; // clockwise or anticlockwise

            ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
            ctx.lineWidth = 20;
            ctx.stroke();
        }
    }
}

function posToCoordinates(position) {
    return [(position % 9)*60-1, (Math.floor(position/9))*60-1]
}

drawSegment(13, 21)
drawSegment(12, 22)

drawSegment(2, 30)
drawSegment(11, 31)
drawSegment(1, 32)
drawSegment(12, 33)

drawSegment(11, 39)
drawSegment(0, 40)
drawSegment(1, 41)
drawSegment(10, 42)

TrackAPI.show(1)