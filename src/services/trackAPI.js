const port = 'http://localhost:3000'

class TrackAPI {
    static baseURL = port + "/tracks";

    static index(num, page) {
        tracksContainer.innerHTML = "";
        fetch(`${this.baseURL}/?_limit=${num}&_page=${page}`)
            .then(resp => resp.json())
            .then(buildTracks);
    }

    static create(name) {
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({name})
        }
        console.log(configObj)
        fetch(this.baseURL,configObj)
            .then(d=>d.json())
            .then(d=>console.log('new track',d))
    }
}