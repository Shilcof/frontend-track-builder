const trackList = document.getElementById('track-list');

const newTrackButton = document.getElementById('new-track');
const saveTrackButton = document.getElementById('save-track');
const editTrackButton = document.getElementById('edit-track');
const deleteTrackButton = document.getElementById('delete-track');
const discardTrackButton = document.getElementById('discard-track');

const trackNameSearch = document.getElementById('track-name-search');
const trackNameInput = document.getElementById('track-name-input');

const canvas = document.getElementById('track-display');
const ctx = canvas.getContext('2d');
ctx.lineWidth = 2;

let currentTrack;
let segmentData = {40: 0};
let creating = false;
let editing = false;

class Track {
    static all = [];

    constructor({id, name, segments}, index = false) {
        this.id = id;
        this.name = name;
        this.segments = Segment.newSegments(segments);
        this.element = document.createElement('div');
        trackList.append(this.element);
        this.element.style.display = "none";
        if (index) Track.all.push(this);
    }

    segmentData() {
        const data = {};
        for (const segment of this.segments) {
            data[segment.position] = segment.segmentType;
        }
        return data;
    }

    render() {
        this.element.innerHTML = `
            <div class="card mb-3 bg-light">
                <div class="card-body" data-id=${this.id}>
                    ${this.name}
                </div>
            </div>
        `;
        return this.element;
    }

    showElement() {
        this.render().style.display = "";
    }

    hideElement() {
        this.render().style.display = "none";
    }

    drawTrack() {
        clearCanvas();
        for(const segment of this.segments) {
            segment.draw(canvas);
        }
    }
}

// Track CRUD actions
const showTrack = (trackInfo, index = false) => {
    renderSidePanel("viewing");
    const track = new Track(trackInfo, index);
    currentTrack = track;
    track.drawTrack();
}

const indexTracks = (tracksInfo) => {
    for (const trackInfo of tracksInfo) {
        const track = new Track(trackInfo, true);
    }
    renderIndex();
}

const createTrack = (track) => {
    creating = false;
    clearCanvas();
    showTrack(track, true);
    renderIndex();
}

const updateTrack = (track) => {
    creating = false;
    editing = false;
    clearCanvas();
    currentTrack.name = track.name;
    console.log(track.segments)
    currentTrack.segments = Segment.newSegments(track.segments);
    debugger
    showTrack(track);
    renderIndex();
}

const deleteTrack = (track) => {
    renderSidePanel("home");
    const t = Track.all.find(t=>t.id === track.id);
    t.hideElement();
    clearCanvas();
}

function renderIndex() {
    const search = new RegExp(trackNameSearch.value, 'gi');
    const tracksToDisplay = Track.all.filter(t=>t.name.match(search))
    for (const track of Track.all) {
        track.hideElement();
    }
    for (const track of tracksToDisplay.slice(Math.max(tracksToDisplay.length - 5, 0))) {
        track.showElement();
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
    clearCanvas();
    (new Segment({segment_type: 0, position: 40})).draw(canvas);
    creating = true;
    renderSidePanel("creating")
    segmentData = {40: 0};
    addGridLines();
}

newTrackButton.addEventListener("click", handleNewTrack)

const handleSaveTrack = (e) => {
    if (editing) {
        TrackAPI.update(trackNameInput.value, segmentData, currentTrack.id);
    } else {
        TrackAPI.create(trackNameInput.value, segmentData);
    }
}

saveTrackButton.addEventListener("click", handleSaveTrack)

const handleEditTrack = (e) => {
    trackNameInput.value = currentTrack.name;
    creating = true;
    editing = true;
    renderSidePanel("creating")
    segmentData = currentTrack.segmentData()
    addGridLines();
}

editTrackButton.addEventListener("click", handleEditTrack)

const handleDeleteTrack = (e) => {
    TrackAPI.destroy(currentTrack.id);
}

deleteTrackButton.addEventListener("click", handleDeleteTrack)

const handleDiscardTrack = (e) => {
    renderSidePanel("home");
    clearCanvas();
    creating = false;
}

discardTrackButton.addEventListener("click", handleDiscardTrack)

trackNameSearch.addEventListener('change', renderIndex)
trackNameSearch.addEventListener('keyup', renderIndex)

// Drag and drop track creation handling
const handleDrop = (e) => {
    e.preventDefault();
    if (!creating || !dragged.classList.contains('segment-canvas')) return
    Segment.new(e.offsetX, e.offsetY, parseInt(dragged.dataset.id));
    addGridLines();
}

canvas.addEventListener("dragover", e => e.preventDefault(), false);

canvas.addEventListener('drop', handleDrop, false);
