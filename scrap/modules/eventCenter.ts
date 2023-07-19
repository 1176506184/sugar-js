class EventCenter {

    private events: any = {};

    constructor() {

    }

    pushEvent(guid, type, event) {
        if (!this.events[guid]) {
            this.events[guid] = {}
        }
        this.events[guid][type] = event;
    }

    removeEvent(guid, event, type) {

        if (this.events[guid][type]) {
            this.events[guid][type].remove();
        }

    }

    getEvent(guid, type) {

        if (!this.events[guid]) {
            return undefined
        }

        return this.events[guid][type]
    }

}

const eventCenter = new EventCenter();
export default eventCenter