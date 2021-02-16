const port = 'http://localhost:3000'

class TrackAPI {
    static baseURL = port + "/tracks";

    static index() {
        trackList.innerHTML = "";
        fetch(this.baseURL)
            .then(resp => resp.json())
            .then(indexTracks);
    }

    static show(id) {
        fetch(`${this.baseURL}/${id}`)
            .then(resp => resp.json())
            .then(showTrack);
    }

    static create(name, segments_attributes) {
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({track: {name, segments_attributes}})
        }
        fetch(this.baseURL,configObj)
            .then(resp=>resp.json())
            .then(createTrack)
    }
}