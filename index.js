// js setup
TrackAPI.index();
Segment.buildSegmentCanvasses();
renderSidePanel("home");
welcomeText();
addJsEventListeners();

// konami feature
const pressed = [];

function checkArrayEquality(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

// side panel helper
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

function welcomeText() {
    ctx.font = '48px serif';
    ctx.fillText('Welcome to', 160, 225);
    ctx.fillText('Track Builder', 140, 275);
}

// driving set up
let accellerating = false;
let rightSteering = 0;
let leftSteering = 0;
let speed = 0;
let timeBefore;
let time;

let animation;

// could be substituded for an ip address fetch
let ip = Math.random();

let colours = [
    "red",
    "blue",
    "yellow",
    "orange",
    "purple"
]

let myCar = {
    position: [255, 269],
    angle: 0,
    colour: colours[Math.floor(Math.random() * colours.length)],
    ip: ip,
    active: true
}
let cars = {};
cars[ip] = myCar;

setInterval(() => {
    cars = {};
    cars[ip] = myCar;
}, 15000);

let ready;
const drawCars = () => {
    if (creating || !currentTrack) return
    // canvas set up
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    clearCanvas();
    currentTrack.drawTrack();
    ctx.lineWidth = 8;

    // interval set up for smooth animation
    timeBefore = time;
    time = new Date;
    let interval = time - timeBefore;
    if (isNaN(interval)) interval = 15;

    // updating this car location based on user input
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

    // drawing all cars to the canvas
    for (const carId in cars) {
        if (cars[carId].active === true) {
            let position = cars[carId].position;
            let angle = cars[carId].angle;
            let colour = cars[carId].colour;
    
            ctx.strokeStyle = colour;
            ctx.beginPath();
            ctx.moveTo(position[0]-5*Math.cos(angle), position[1]-5*Math.sin(angle));
            ctx.lineTo(position[0]+5*Math.cos(angle), position[1]+5*Math.sin(angle));
            ctx.stroke();
        }
    }

    // resetting the canvas
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

    // sending to the server the users car location
    if (ready && channel === currentTrack.id) updateCarLocation();

    // requesting next animation and storing key to stop animation
    animation = (window.requestAnimationFrame(drawCars));
}

// socket set up
const socket = new WebSocket(webSocket);

socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.type === 'ping' || creating || !data.message) return
    const carData = data.message.content;
    if (ip !== carData.ip && ready) cars[carData.ip] = carData;
    if (carData.active === false) {
        setTimeout(() => {
            cars = {};
            cars[ip] = myCar;
        }, 30);
        cars = {};
        cars[ip] = myCar;
    }
}

socket.onclose = () => {
    removeCar(channel);
    unsubscribeFrom(channel);
}

let channel;
let readyTimeout;
function requestSubscribe() {
    ready = false;
    if (readyTimeout) clearTimeout(readyTimeout);
    readyTimeout = setTimeout(()=>ready=true, 100);

    if (channel) {
        removeCar(channel);
        unsubscribeFrom(channel);
    }

    const message = {
        command: "subscribe",
        identifier: JSON.stringify({channel: "TrackChannel", id: currentTrack.id})
    };
    socket.send(JSON.stringify(message));

    channel = currentTrack.id;
    
    cars = {};
    cars[ip] = myCar;
}

function unsubscribeFrom(channelNumber) {
    const message = {
        command: "unsubscribe",
        identifier: JSON.stringify({channel: "TrackChannel", id: channelNumber})
    };
    socket.send(JSON.stringify(message));
}

function removeCar(channelNumber) {
    const removeCar = {...myCar};
    removeCar.active = false;
    let message = {
        command: "message",
        identifier: JSON.stringify({channel: "TrackChannel", id: channelNumber}),
        data: JSON.stringify(removeCar)
    };
    socket.send(JSON.stringify(message));
}

function updateCarLocation() {
    const message = {
        command: "message",
        identifier: JSON.stringify({channel: "TrackChannel", id: currentTrack.id}),
        data: JSON.stringify(myCar)
    };
    socket.send(JSON.stringify(message));
}

// Event listeners
function addJsEventListeners() {
    const home = document.getElementById("home-link");
    
    home.addEventListener('click',e=> {
        creating = false;
        currentTrack = null;
        renderSidePanel('home');
        clearCanvas();
        welcomeText();
    })
    
    window.addEventListener('keyup', (e) => {
        const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
        pressed.push(e.key);
        pressed.splice(-konami.length - 1, pressed.length - konami.length);
        if (checkArrayEquality(pressed, konami)) {
            const editTrackButton = document.getElementById('edit-track');
            const deleteTrackButton = document.getElementById('delete-track');
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

    window.addEventListener('keydown', e => {
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

    window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        removeCar(channel);
        unsubscribeFrom(channel);
    });
}