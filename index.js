const home = document.getElementById("home-link");
const homePanel = document.getElementById("home");
const viewingPanel = document.getElementById("viewing");
const creatingPanel = document.getElementById("creating");
const panels = [homePanel, creatingPanel, viewingPanel]

let cars = [
    {
        position: [100, 100],
        angle: 0,
        colour: "blue"
    },
    {
        position: [200, 200],
        angle: 0.25 * Math.PI,
        colour: "yellow"
    }
];

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

// game trials
var earth = new Image();
const drawCars = () => {
    if (creating || !currentTrack) return
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    clearCanvas();
    currentTrack.drawTrack();

    for (const car of cars) {
        let position = car.position;
        let angle = car.angle;
        let colour = car.colour;

        ctx.strokeStyle = colour;
        ctx.beginPath();
        ctx.moveTo(position[0]-5*Math.cos(angle), position[1]-5*Math.sin(angle));
        ctx.lineTo(position[0]+5*Math.cos(angle), position[1]+5*Math.sin(angle));
        ctx.stroke();
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

    window.requestAnimationFrame(drawCars);
}

window.requestAnimationFrame(drawCars);

// socket trails
const socket = new WebSocket(webSocket);

socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.type === 'ping' || creating || !data.content) return
    cars = data.cars;
}

window.addEventListener('keydown', e => {
    e.preventDefault();
    console.log(e);
    // CarAPI.update();
});

function requestSubscribe() {
    const message = {
        command: "subscribe",
        identifier: JSON.stringify({channel: "TrackChannel"})
    };
    socket.send(JSON.stringify(message));
}