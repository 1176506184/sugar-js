import makeReactive from "./reactive";

const reactive = function (value) {
    if (!value || typeof value !== 'object') {
        console.error('this value is not allow');
    }
    return makeReactive(value);
}

export {
    reactive
}