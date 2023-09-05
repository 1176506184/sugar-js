import {makeSugar, onMounted} from "@sugar/sugar-core";
import {createEffect, reactive, reckon, ref} from "@sugar/sugar-reactive";
import {createComponent} from "@sugar/sugar-component";
import {div,text} from "@sugar/sugar-x";
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
        div,
        text
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
