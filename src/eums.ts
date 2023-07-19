import {makeMap} from "./utils/utils";

const ElementNodeType = 1;
const TextNodeType = 3;

interface Options {
    el: HTMLElement | string,
    components: any | undefined
}

const mountState = {
    start: 0,
    pending: 1,
    end: 2
}

interface componentType {
    name: string,
    render: string
}

export {ElementNodeType, TextNodeType, Options, mountState, componentType}