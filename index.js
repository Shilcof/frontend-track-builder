const home = document.getElementById("home-link");
const id = Math.random();

let animation;

let myCar = {
    position: [300, 300],
    angle: 0,
    colour: "red",
    id: id
}

let cars = {};
cars[id] = myCar;

const pressed = [];

function checkArrayEquality(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

window.addEventListener('keyup', (e) => {
    const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    pressed.push(e.key);
    pressed.splice(-konami.length - 1, pressed.length - konami.length);
    if (checkArrayEquality(pressed, konami)) {
        editTrackButton.style.display = "";
        deleteTrackButton.style.display = "";
    }
    switch(e.key) {
        case "ArrowUp":
            accellerating = false;
            break;
        case "ArrowLeft":
            leftSteering = 0;
            break;
        case "ArrowRight":
            rightSteering = 0;
            break;
        default:
            return
    }
});

function renderSidePanel(panelName) {
    const homePanel = document.getElementById("home");
    const viewingPanel = document.getElementById("viewing");
    const creatingPanel = document.getElementById("creating");
    const panels = [homePanel, creatingPanel, viewingPanel]
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
    currentTrack = null;
    renderSidePanel('home');
    // code for welcom canvas here?
    clearCanvas();
})

// game trials
let accellerating = false;
let rightSteering = 0;
let leftSteering = 0;
let speed = 0;
let timeBefore;
let time;

const drawCars = () => {
    if (creating || !currentTrack) return
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    clearCanvas();
    currentTrack.drawTrack();
    ctx.lineWidth = 8;

    timeBefore = time;
    time = new Date;

    let interval = time - timeBefore;
    if (isNaN(interval)) interval = 15;

    
    if (accellerating) {
        speed += 60*interval/10000;
        if (speed > 25/interval) speed = 25/interval;
    } else {
        speed -= 60*interval/10000;
        if (speed < 0) speed = 0;
    }

    myCar.position[0] += speed*Math.cos(myCar.angle);
    myCar.position[1] += speed*Math.sin(myCar.angle);
    if (myCar.position[0] < 5) myCar.position[0] = 5;
    if (myCar.position[1] < 5) myCar.position[1] = 5;
    if (myCar.position[0] > 535) myCar.position[0] = 535;
    if (myCar.position[1] > 535) myCar.position[1] = 535;

    myCar.angle += (2.5*(rightSteering - leftSteering)*Math.PI/10)/interval;

    for (const carId in cars) {
        let position = cars[carId].position;
        let angle = cars[carId].angle;
        let colour = cars[carId].colour;

        ctx.strokeStyle = colour;
        ctx.beginPath();
        ctx.moveTo(position[0]-5*Math.cos(angle), position[1]-5*Math.sin(angle));
        ctx.lineTo(position[0]+5*Math.cos(angle), position[1]+5*Math.sin(angle));
        ctx.stroke();
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

    updateCarLocation();

    animation = (window.requestAnimationFrame(drawCars));
}

// socket trails
const socket = new WebSocket(webSocket);

socket.onopen = function(e){
    requestSubscribe();
 }

socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.type === 'ping' || creating || !data.message) return
    const carData = data.message.content;
    cars[carData.id] = carData;
    // cars = data.cars;
}

window.addEventListener('keydown', e => {
    e.preventDefault();
    switch(e.key) {
        case "ArrowUp":
            accellerating = true;
            break;
        case "ArrowLeft":
            leftSteering = 1;
            break;
        case "ArrowRight":
            rightSteering = 1;
            break;
        default:
            return
    }
});

function requestSubscribe() {
    const message = {
        command: "subscribe",
        identifier: JSON.stringify({channel: "TrackChannel"})
    };
    socket.send(JSON.stringify(message));
}

function updateCarLocation() {
    const message = {
        command: "message",
        identifier: JSON.stringify({channel: "TrackChannel"}),
        data: JSON.stringify(myCar)
    };
    socket.send(JSON.stringify(message));
}

    // cars[1].position[0] += 1*Math.cos(cars[1].angle);
    // cars[1].position[1] += 1*Math.sin(cars[1].angle);
    // if (cars[1].position[0] < 5) cars[1].position[0] = 5;
    // if (cars[1].position[1] < 5) cars[1].position[1] = 5;
    // if (cars[1].position[0] > 535) cars[1].position[0] = 535;
    // if (cars[1].position[1] > 535) cars[1].position[1] = 535;
    // if (Math.floor(10*Math.random()) === 0) cars[1].angle += (3*Math.random()-1)*Math.PI/10;