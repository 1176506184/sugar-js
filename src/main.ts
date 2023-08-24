import onMounted from "./hooks/onMounted";
import {reactive,reckon,ref,createEffect} from "@sugar/sugar-reactive";
import makeSugar from "./core";


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
    ref
}
