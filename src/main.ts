import {createEffect} from "./signal/createEffect";
import onMounted from "./hooks/onMounted";
import installComponent from './component';
import {reactive} from "./reactive";
import makeSugar from "./core";

window['createEffect'] = createEffect
window['onMounted'] = onMounted
window['installComponent'] = installComponent
window['reactive'] = reactive
window['makeSugar'] = makeSugar

export {
    makeSugar,
    reactive,
    onMounted,
    createEffect
}
