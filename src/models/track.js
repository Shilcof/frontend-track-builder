class Track {
    static all = [];

    constructor({name, segments}) {
        this.name = name;
        this.segments = Segment.newSegments(segments);
        this.liElement = document.createElement("div");
        Track.all.push(this);
    }

    render() {
        this.liElement.innerHTML = `
            <li>${this.name}</li>
        `;
        return this.liElement;
    }

    addToDOM() {
        trackList.appendChild(this.render());
    }

    drawTrack() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(const segment of this.segments) {
            // drawSegment(segment.segment_type, segment.position);
            segment.draw();
        }
    }
}

function buildTrack(info) {
    const track = new Track(info);
    track.drawTrack()
}