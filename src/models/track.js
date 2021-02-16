const trackList = document.getElementById('track-list');
const newTrackButton = document.getElementById('new-track');
const saveTrackButton = document.getElementById('save-track');
const trackNameInput = document.getElementById('track-name-input');
const canvas = document.getElementById('track-display');
const ctx = canvas.getContext('2d');
ctx.lineWidth = 2;

let segmentData = {40: 0};
let creating = false;
let editing = false;

class Track {
    static all = [];

    constructor({id, name, segments}, index = false) {
        this.id = id;
        this.name = name;
        this.segments = Segment.newSegments(segments);
        this.liElement = document.createElement('div');
        trackList.append(this.liElement);
        this.liElement.style.display = "none";
        if (index) Track.all.push(this);
    }

    render() {
        this.liElement.innerHTML = `
            <li data-id=${this.id}>${this.name}</li>
        `;
        return this.liElement;
    }

    show() {
        this.render().style.display = "";
    }

    drawTrack() {
        clearCanvas();
        for(const segment of this.segments) {
            segment.draw(canvas);
        }
    }
}

// Track CRUD action
const showTrack = (trackInfo, index = false) => {
    const track = new Track(trackInfo, index);
    track.drawTrack();
}

const indexTracks = (tracksInfo) => {
    for (const trackInfo of tracksInfo) {
        const track = new Track(trackInfo, true);
    }
    renderIndex();
}

const createTrack = (track) => {
    hideEditor();
    showTrack(track, true);
    renderIndex();
}

function renderIndex() {
    for (const track of Track.all) {
        track.show();
    }
}

// Track canvas functions
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearSegment(position) {
    [x, y] = posToCoordinates(position)
    ctx.clearRect(x, y, canvas.width/9, canvas.height/9);
}

function addGridLines() {
    ctx.strokeStyle = "white";
    ctx.setLineDash([10, 20]);
    for (let i = 1; i < 9; i++) {
        ctx.beginPath();
        ctx.moveTo(9, i*60-1);
        ctx.lineTo(canvas.width-9, i*60-1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i*60-1, 9);
        ctx.lineTo(i*60-1, canvas.width-9);
        ctx.stroke();
    }
    ctx.strokeStyle = "black";
    ctx.setLineDash([]);
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
    if (newTrackButton.innerText === "Create a new track") {
        newTrackButton.innerText = "Discard track";
        creating = true;
        segmentData = {40: 0};
        clearCanvas();
        (new Segment({segment_type: 0, position: 40})).draw(canvas);
        addGridLines();
        [...document.getElementsByClassName('segment-canvas')].forEach(canvas=>canvas.style.display = "");
        saveTrackButton.style.display = "";
        trackNameInput.style.display = "";
    } else {
        hideEditor()
    }
}

function hideEditor() {
    newTrackButton.innerText = "Create a new track";
    creating = false;
    clearCanvas();
    [...document.getElementsByClassName('segment-canvas')].forEach(canvas=>canvas.style.display = "none");
    saveTrackButton.style.display = "none";
    trackNameInput.style.display = "none";
}

newTrackButton.addEventListener("click", handleNewTrack)

const handleSaveTrack = (e) => {
    if (editing) {
        // placeholder for editing functionalities
    } else {
        TrackAPI.create(trackNameInput.value, segmentData);
    }
}

saveTrackButton.addEventListener("click", handleSaveTrack)

// Drag and drop track creation handling
const handleDrop = (e) => {
    e.preventDefault();
    if (!creating || !dragged.classList.contains('segment-canvas')) return
    Segment.new(e.offsetX, e.offsetY, parseInt(dragged.dataset.id));
    addGridLines();
}

canvas.addEventListener("dragover", e => e.preventDefault(), false);

canvas.addEventListener('drop', handleDrop, false);