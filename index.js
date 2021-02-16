const homePanel = document.getElementById("home");
const viewingPanel = document.getElementById("viewing");
const creatingPanel = document.getElementById("creating");
const panels = [homePanel, creatingPanel, viewingPanel]

function renderSidePanel(panelName) {
    for (const panel of panels) {
        if (panel.id === panelName ) {
            panel.style.display = ""
        } else {
            panel.style.display = "none"
        }
    }
}

TrackAPI.index();
Segment.buildSegmentCanvasses();
renderSidePanel("home")