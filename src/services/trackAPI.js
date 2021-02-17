const port = 'http://localhost:3000'

class TrackAPI {
    static baseURL = port + "/tracks";

    static configObj(method, body) {
        return {
            method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        }
    }

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
        const configObj = this.configObj("POST", {track: {name, segments_attributes}});
        fetch(this.baseURL,configObj)
            .then(resp=>resp.json())
            .then(createTrack)
    }

    static update(name, segments_attributes, id) {
        const configObj = this.configObj("PATCH", {track: {name, segments_attributes}});
        fetch(`${this.baseURL}/${id}`,configObj)
            .then(resp=>resp.json())
            .then(updateTrack)
    }

    static destroy(id) {
        const configObj = this.configObj("DELETE", null);
        fetch(`${this.baseURL}/${id}`,configObj)
            .then(resp=>resp.json())
            .then(deleteTrack)
    }
}