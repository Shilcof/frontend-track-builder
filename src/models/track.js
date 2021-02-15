const trackList = document.getElementById('track-list')
const canvas = document.getElementById('track-display');
const ctx = canvas.getContext('2d');

class Track {
    static all = [];

    constructor({name, segments}) {
        this.name = name;
        this.segments = Segment.newSegments(segments);
        this.liElement = document.createElement('div');
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
        this.liElement.addEventListener('click',()=>this.drawTrack)
    }

    drawTrack() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(const segment of this.segments) {
            segment.draw();
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
        debugger
        track.addToDOM();
    }
}