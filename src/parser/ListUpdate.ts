import  {getDataWithKey, getDataWithKeyExtra} from "./getDataWithKeyStr";
import {createEffect} from "../signal/createEffect";
import {bindSForElement} from "./parse";

const pattern = /[`~!@#$^\-&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
const eval2 = eval;

export default function ListUpdate(list, stack, appId) {
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
                let key = stack.reactive[j].replaceAll(stack.direction, `${stack.directive[1]}[${i}]`).match(/{{(.+?)}}/)[1];
                NewHtml = NewHtml.replaceAll(stack.reactive[j], getDataWithKeyExtra(key, appId))
            } else {

                let result = getDataWithKey(stack.reactive[j].match(/{{(.+?)}}/)[1], appId)
                if (result !== "this result is not defined and error in sugar-js") {
                    NewHtml = NewHtml.replaceAll(stack.reactive[j], result)
                }

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
        forUpdate(div, appId)

    }

    stack.oldValue = list;


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
