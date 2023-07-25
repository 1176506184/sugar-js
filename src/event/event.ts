import getDataWithKeyStr, {getDataWithKey} from "../parser/getDataWithKeyStr";
import {createEffect} from "../main";

function BindEvent(node, appId) {

    Array.from(node.attributes).forEach((a: any) => {
        if (a.name.indexOf('s-on:') > -1) {
            node.addEventListener(a.name.replace('s-on:', ''), () => {
                try {
                    window[`sugarBulk_${appId}`][a.value]();
                } catch (e) {
                    console.log(appId, a.value)
                    console.log(window[`sugarBulk_${appId}`][e.value])
                    console.log(e);
                }

            })

            node.removeAttribute(a.name);
        }

        if (a.name.charAt(0) === ':') {

            createEffect(()=>{
                node.setAttribute(a.name.replace(':', ''), getDataWithKey(a.value, appId));
            })

        }


    })

}

export {
    BindEvent
}