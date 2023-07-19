let components = {};
import {componentType} from "../eums";

export default function (component: componentType) {

    if (typeof window['sugarComponent'] != "undefined") {
        components = window['sugarComponent'];
    }

    components[component.name.toLocaleLowerCase()] = component.render;
}

export {components}