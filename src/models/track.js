const trackList = document.getElementById('track-list')
const canvas = document.getElementById('track-display');
const ctx = canvas.getContext('2d');

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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(const segment of this.segments) {
            segment.draw();
        }
    }
}

const handleTrackShow = (e) => {
    if (e.target.dataset.id) {
        TrackAPI.show(e.target.dataset.id)
    }
}

trackList.addEventListener("click", handleTrackShow)

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