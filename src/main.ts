import {onMounted, makeSugar} from "@sugar/sugar-core";
import {reactive, reckon, ref, createEffect} from "@sugar/sugar-reactive";
import {createComponent} from "@sugar/sugar-component";
import {button} from "@sugar/sugar-ui";

// @ts-ignore
// window['createEffect'] = createEffect
// window['onMounted'] = onMounted
// window['reactive'] = reactive
// window['makeSugar'] = makeSugar
// window['reckon'] = reckon
// window['ref'] = ref;
// window['createComponent'] = createComponent
// window['sugarUI'] = [button]

(function (global: any) {

    global.createEffect = createEffect
    global.onMounted = onMounted
    global.reactive = reactive
    global.makeSugar = makeSugar
    global.reckon = reckon
    global.ref = ref;
    global.createComponent = createComponent
    global.sugarUI = [button]

})(window);

export {
    makeSugar,
    reactive,
    onMounted,
    createEffect,
    reckon,
    ref,
    createComponent
}
