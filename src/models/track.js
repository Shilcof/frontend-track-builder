const trackList = document.getElementById('track-list');
const newTrackButton = document.getElementById('new-track');
const canvas = document.getElementById('track-display');
const ctx = canvas.getContext('2d');

let creating = false;

class Track {
    static all = [];

    constructor({id, name, segments}) {
        this.id = id;
        this.name = name;
        this.segments = Segment.newSegments(segments);
        this.liElement = document.createElement('div');
        Track.all.push(this);
    }

    render() {
        this.liElement.innerHTML = `
            <li data-id=${this.id}>${this.name}</li>
        `;
        return this.liElement;
    }

    addToDOM() {
        trackList.appendChild(this.render());
    }

    drawTrack() {
        clearCanvas();
        for(const segment of this.segments) {
            segment.draw(canvas);
        }
    }
}

function showTrack(trackInfo) {
    const track = new Track(trackInfo);
    track.drawTrack();
}

function indexTracks(tracksInfo) {
    for (const trackInfo of tracksInfo) {
        const track = new Track(trackInfo);
        track.addToDOM();
    }
}

// Track canvas functions

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function addGridLines() {
    ctx.strokeStyle = "white";
    ctx.setLineDash([10, 20]);
    for (let i = 1; i < 9; i++) {
        ctx.beginPath();
        ctx.moveTo(10, i*60);
        ctx.lineTo(canvas.width-10, i*60);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i*60, 10);
        ctx.lineTo(i*60, canvas.width-10);
        ctx.stroke();
    }
    ctx.strokeStyle = "black";
}

// Track related event listeners and functions

const handleTrackShow = (e) => {
    if (creating) return
    if (e.target.dataset.id) {
        TrackAPI.show(e.target.dataset.id)
    }
}

trackList.addEventListener("click", handleTrackShow)

const handleNewTrack = (e) => {
    creating = true;
    clearCanvas();
    addGridLines();
}

newTrackButton.addEventListener("click", handleNewTrack)
