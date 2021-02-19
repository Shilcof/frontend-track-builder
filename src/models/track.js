const trackList = document.getElementById('track-list');
const trackNameSearch = document.getElementById('track-name-search');
const trackNameInput = document.getElementById('track-name-input');
const trackCreatorInput = document.getElementById('track-creator-input');
const errorMessages = document.getElementById('error-messages');
const canvas = document.getElementById('track-display');
const ctx = canvas.getContext('2d');

ctx.lineWidth = 2;

let currentTrack;
let segmentData = {40: 0};
let creating = false;
let editing = false;

addTrackEventListeners();

class Track {
    static all = [];

    constructor({id, name, creator, segments}, index = false) {
        this.id = id;
        this.name = name;
        this.creator = creator;
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
            <div class="card mb-3 pb-n1 bg-light" data-id=${this.id}>
                <div class="card-body" data-id=${this.id}>
                    <h5 data-id=${this.id}>${this.name}</h5> 
                    created by: ${this.creator ? this.creator : 'anonymous'}
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

    static index = (tracksInfo) => {
        for (const trackInfo of tracksInfo) {
            const track = new Track(trackInfo, true);
        }
        renderIndex();
    }

    static show = (trackInfo, index = false) => {
        const trackName = document.getElementById('track-name');
        const createdBy = document.getElementById('created-by');
        renderSidePanel("viewing");
        const track = new Track(trackInfo, index);
        currentTrack = track;
        trackName.innerHTML = `${track.name}`
        createdBy.innerHTML = `created by: ${track.creator ? track.creator : 'anonymous'}`
        track.drawTrack();
        window.cancelAnimationFrame(animation);
        requestSubscribe();
        animation = window.requestAnimationFrame(drawCars);
    }

    static create = (track) => {
        if (track.status !== "error") {
            creating = false;
            clearCanvas();
            Track.show(track, true);
            renderIndex();
        } else {
            throw new Error(track.message);
        }
    }

    static update = (track) => {
        if (track.status !== "error") {
            creating = false;
            editing = false;
            clearCanvas();
            currentTrack.name = track.name;
            console.log(track.segments)
            currentTrack.segments = Segment.newSegments(track.segments);
            debugger
            Track.show(track);
            renderIndex();
        } else {
            throw new Error(track.message);
        }
    }

    static destroy = (track) => {
        renderSidePanel("home");
        const t = Track.all.find(t=>t.id === track.id);
        const tIndex = Track.all.indexOf(t);
        Track.all.splice(tIndex, 1);
        t.hideElement();
        renderIndex();
        clearCanvas();
    }
}

const displayErrors = (errors) => {
    const messages = errors.message.split(',')
    errorMessages.innerHTML = `
        <p>${messages.length} errors prevented saving this track.</p>
    `
    for (const error of messages) {
        errorMessages.innerHTML += `<li>${error}.</li>`
    }
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
function addTrackEventListeners() {
    const newTrackButton = document.getElementById('new-track');
    const saveTrackButton = document.getElementById('save-track');
    const editTrackButton = document.getElementById('edit-track');
    const deleteTrackButton = document.getElementById('delete-track');
    const discardTrackButton = document.getElementById('discard-track');

    const handleTrackShow = (e) => {
        if (creating) return
        if (e.target.dataset.id) {
            TrackAPI.show(e.target.dataset.id)
        }
    }
    
    const handleNewTrack = (e) => {
        errorMessages.innerHTML = '';
        trackNameInput.value = "";
        trackCreatorInput.value = "";
        clearCanvas();
        (new Segment({segment_type: 0, position: 40})).draw(canvas);
        creating = true;
        renderSidePanel("creating")
        segmentData = {40: 0};
        addGridLines();
    }
    
    const handleSaveTrack = (e) => {
        if (editing) {
            TrackAPI.update(trackNameInput.value, trackCreatorInput.value, segmentData, currentTrack.id);
        } else {
            TrackAPI.create(trackNameInput.value, trackCreatorInput.value, segmentData);
        }
    }
    
    const handleEditTrack = (e) => {
        errorMessages.innerHTML = '';
        trackNameInput.value = currentTrack.name;
        trackCreatorInput.value = currentTrack.creator;
        creating = true;
        editing = true;
        renderSidePanel("creating")
        segmentData = currentTrack.segmentData()
        clearCanvas();
        currentTrack.drawTrack();
        addGridLines();
    }
    
    const handleDeleteTrack = (e) => {
        TrackAPI.destroy(currentTrack.id);
    }
    
    const handleDiscardTrack = (e) => {
        renderSidePanel("home");
        clearCanvas();
        creating = false;
    }
    
    trackList.addEventListener("click", handleTrackShow)
    newTrackButton.addEventListener("click", handleNewTrack);
    saveTrackButton.addEventListener("click", handleSaveTrack);
    editTrackButton.addEventListener("click", handleEditTrack);
    deleteTrackButton.addEventListener("click", handleDeleteTrack);
    discardTrackButton.addEventListener("click", handleDiscardTrack);
    trackNameSearch.addEventListener('change', renderIndex);
    trackNameSearch.addEventListener('keyup', renderIndex);
    // Drag and drop track creation handling
    const handleDrop = (e) => {
        e.preventDefault();
        if (!creating || !dragged.classList.contains('segment-canvas')) return
        Segment.new(e.offsetX, e.offsetY, parseInt(dragged.dataset.id));
        addGridLines();
    }

    canvas.addEventListener("dragover", e => e.preventDefault(), false);
    canvas.addEventListener('drop', handleDrop, false);
}