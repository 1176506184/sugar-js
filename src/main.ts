import {onMounted,makeSugar} from "@sugar/sugar-core";
import {reactive, reckon, ref, createEffect} from "@sugar/sugar-reactive";
import {createComponent} from "@sugar/sugar-component";

// @ts-ignore
window['createEffect'] = createEffect
window['onMounted'] = onMounted
window['reactive'] = reactive
window['makeSugar'] = makeSugar
window['reckon'] = reckon
window['ref'] = ref;
window['createComponent'] = createComponent

export {
    makeSugar,
    reactive,
    onMounted,
    createEffect,
    reckon,
    ref,
    createComponent
}
