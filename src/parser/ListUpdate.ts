import {getDataWithKey, getDataWithKeyExtra} from "./getDataWithKeyStr";
import {createEffect} from "../signal/createEffect";
import parse, {bindSForElement} from "./parse";
import deepClone from "../utils/deepClone";

const pattern = /[`~!@#$^\-&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
const eval2 = eval;

export default function ListUpdate(list, stack, appId, data?) {
    const notNeedUp = [] as any[]

    if (!stack.mounted) {
        stack.mounted = true;
    } else {
        for (let i = 0; i < stack.ListNodes.length; i++) {
            stack.ListNodes[i].remove()
        }
        stack.ListNodes = []
    }


    for (let i = 0; i < list.length; i++) {

        if (stack.if) {
            if (getFirstKey(stack.if, appId) === stack.direction) {

                let key = stack.if.replaceAll(stack.direction, `${stack.directive[1]}[${i}]`);
                let result = getDataWithKeyExtra(key, appId);
                if (!result) {
                    continue
                }

            } else {
                let result = getDataWithKey(stack.if.match(/{{(.+?)}}/)[1], appId)
                if (!result) {
                    continue
                }
            }
        }

        let div = document.createElement("div");
        let NewHtml = stack.html;
        for (let j = 0; j < stack.reactive.length; j++) {
            if (getFirstKey(stack.reactive[j].match(/{{(.+?)}}/)[1], appId) === stack.direction) {
                let key = stack.reactive[j].replaceAll(stack.direction, `${stack.directive[1]}[${i}]`);
                NewHtml = NewHtml.replaceAll(stack.reactive[j], key)
            }
        }

        if (!stack.ListNodes.length) {
            stack.comment.after(div);
            stack.ListNodes.push(div);
        } else {
            stack.ListNodes[i - 1].after(div);
            stack.ListNodes.splice(i, 0, div);
        }
        div.innerHTML = NewHtml;
        replaceAttr(div, stack.direction, stack.directive[1], appId, i)

        parse(div, data, appId)
        forUpdate(div, appId)

    }

    stack.oldValue = list;


}

function replaceAttr(n, d, dc, appId, i) {

    function work(n) {

        n.childNodes.forEach((ns, index) => {

            if (ns.attributes) {

                let attributes = Array.from(ns.attributes).map((a: any) => {
                    return {
                        name: a.name,
                        value: a.value
                    }
                });

                attributes.forEach((attr: any) => {

                    if (attr.value.indexOf(d) > -1) {
                        ns.removeAttribute(attr.name)
                        ns.setAttribute(attr.name, attr.value.replace(d, `${dc}[${i}]`))
                    }

                })

            }

            if (ns.childNodes.length > 0) {
                work(ns)
            }
        })

    }

    work(n)

}

function getFirstKey(keyStr, appId) {

    let keyArr = keyStr.split('.');
    let keyExArr = keyStr.split('[')
    return keyArr[0].length > keyExArr[0].length ? keyExArr[0] : keyArr[0]
}


function forUpdate(el: HTMLElement, appId) {
    function work(node) {

        node.childNodes.forEach((n, index) => {


            if (n.nodeType === 1 && !!n.getAttribute('s-for')) {
                bindSForElement(n, appId);
            }

            if (n.nodeType === 1 && n.childNodes.length > 0) {
                work(n);
            }

        })

    }

    work(el);
}
