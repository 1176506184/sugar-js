import {getCurrentObserver} from "../signal/createEffect";

let subscribers = new Set();
const makeReactive = function (value) {

    const createGetter = function (target, propKey, receiver) {

        let val = Reflect.get(target, propKey, receiver);
        if (isObject(val)) {
            return new Proxy(val, {
                get: createGetter,
                set: createSetter
            }) // 代理内层属性
        }
        const currentObserver = getCurrentObserver();
        if (currentObserver) {
            subscribers.add(currentObserver);
        }
        return Reflect.get(target, propKey, receiver);
    }

    const createSetter = function (target, propKey, value, receiver) {
        let result = Reflect.set(target, propKey, value, receiver);
        subscribers.forEach((subscriber: Function) => subscriber());
        return result;
    }


    return new Proxy(value, {
        get: createGetter,
        set: createSetter
    })

}

function clearReactive() {
    subscribers = new Set();
}

function isArray(value) {

    return Object.prototype.toString.call(value) === '[object Array]'

}

const isObject = val => val !== null && typeof val === 'object';

export default makeReactive
export {clearReactive}