import {createEffect} from "./signal/createEffect";
import onMounted from "./hooks/onMounted";
import {reactive} from "./reactive";
import makeSugar from "./core";
import reckon, {ref} from "./reactive/reckon"
import sugarUI from "./ui";


// @ts-ignore
window['createEffect'] = createEffect
window['onMounted'] = onMounted
window['reactive'] = reactive
window['makeSugar'] = makeSugar
window['reckon'] = reckon
window['ref'] = ref;


export {
    makeSugar,
    reactive,
    onMounted,
    createEffect,
    reckon,
    sugarUI,
    ref
}
