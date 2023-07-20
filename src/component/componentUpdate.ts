import {BindIfElement, bindSForElement, BindTextElement} from "../parser/parse";
import getSlot from "./getSlot";

export function componentUpdate(n, node, index, work: Function, CacheNode, appId) {


    if (n.nodeType === 1 && !!n.getAttribute('s-if') && !n.getAttribute('s-for')) {
        BindIfElement(n);
    }

    if (n.nodeType === 3) {
        BindTextElement(n, index, node)
        return
    }

    if (n.nodeType === 1 && !!n.getAttribute('s-for')) {
        bindSForElement(n)
        return
    }

    if (n.nodeType === 1 && n.childNodes) {
        work(n, CacheNode);
    }


}