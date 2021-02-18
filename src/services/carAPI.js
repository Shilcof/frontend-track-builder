const webSocket = 'ws://localhost:3000/cable';

class CarAPI {
    static baseURL = port + "/cars";

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

    static update(position, angle, colour, id) {
        const configObj = this.configObj("PATCH", {car: {position, angle, colour}});
        fetch(`${this.baseURL}/${id}`,configObj)
    }
}