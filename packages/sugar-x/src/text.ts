import {nodeUtils} from "./utils";
import {createEffect} from "@sugar/sugar-reactive";

export function text(str) {
    const node = nodeUtils.cText(str)
    createEffect(() => {
        if (typeof str === 'string') {
            node.textContent = str
        } else {
            node.textContent = str.value
        }

    })
    return node
}