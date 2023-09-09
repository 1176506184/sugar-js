import {makeSugar, onMounted} from "@sugar/sugar-core";
import {createEffect, reactive, reckon, ref} from "@sugar/sugar-reactive";
import {createComponent} from "@sugar/sugar-component";
// @ts-ignore

(function (global: any) {

    global.SUGAR = {
        createEffect,
        onMounted,
        reactive,
        makeSugar,
        reckon,
        ref,
        createComponent,
    }

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
