import {createEffect} from "../signal/createEffect";
import getDataWithKeyStr from "./getDataWithKeyStr";

const eval2 = eval;

export function BindModelElement(n, appId) {
    let model = n.getAttribute('s-model')
    n.removeAttribute('s-model');
    if (n.nodeName === 'INPUT') {
        n.addEventListener('input', (e) => {
            window['tempSugarModel'] = e.target.value
            eval2(`window['sugarBulk_${appId}'].${model} = window['tempSugarModel']`)
            window['tempSugarModel'] = null
        })

        createEffect(() => {
            n.value = getDataWithKeyStr(model, null, null, null, null, appId);
        })

    } else if (n.nodeName === 'TEXTAREA') {

    }
}



