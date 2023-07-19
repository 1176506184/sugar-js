import {getCurrentObserver} from "./createEffect";
import signal from "./signal";

const createSignal = (value) => {
    const subscribers = new Set();
    let _Effect = null as any;

    const getter = () => {
        _Effect = getCurrentObserver();
        const currentObserver = getCurrentObserver();
        if (currentObserver) {
            subscribers.add(currentObserver);
        }
        return value
    }

    const setter = (newValue) => {
        value = newValue
        subscribers.forEach((subscriber: Function) => subscriber());
    }

    getter.prototype['setter'] = setter;



    return [getter, setter]

}

export default createSignal;