const home = document.getElementById("home-link");
const homePanel = document.getElementById("home");
const viewingPanel = document.getElementById("viewing");
const creatingPanel = document.getElementById("creating");
const panels = [homePanel, creatingPanel, viewingPanel]

const pressed = [];
const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function checkArrayEquality(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

window.addEventListener('keyup', (e) => {
    pressed.push(e.key);
    pressed.splice(-konami.length - 1, pressed.length - konami.length);
    if (checkArrayEquality(pressed, konami)) {
        editTrackButton.style.display = "";
        deleteTrackButton.style.display = "";
    }
});

function renderSidePanel(panelName) {
    for (const panel of panels) {
        if (panel.id === panelName ) {
            panel.style.display = "";
        } else {
            panel.style.display = "none";
        }
    }
}

TrackAPI.index();
Segment.buildSegmentCanvasses();
renderSidePanel("home")

home.addEventListener('click',e=> {
    creating = false;
    renderSidePanel('home');
    // code for welcom canvas here?
    clearCanvas();
})