import getDataWithKeyStr from "./getDataWithKeyStr";
import {componentUpdate} from "../component/componentUpdate";
import {createEffect} from "../signal/createEffect";
import {bindSForElement} from "./parse";

const pattern = /[`~!@#$^\-&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
const eval2 = eval;
export default function ListUpdate(list, stack) {
    const notNeedUp = [] as any[]

    let sIf = true

    if (stack.if) {
        let state = getDataWithKeyStr(stack.if);
        if (!state) {
            sIf = false;
            stack.oldValue = [];
        } else {
            sIf = true
        }
    }

    if (!stack.mounted) {
        stack.mounted = true;
    } else {


        for (let i = 0; i < stack.ListNodes.length; i++) {

            if (!sIf) {
                stack.ListNodes[i].remove()
            } else {
                if (JSON.stringify(stack.oldValue[i]) !== JSON.stringify(list[i])) {
                    stack.ListNodes[i].remove()
                    stack.ListNodes.splice(Number(i), 1);
                    i--;
                } else {
                    notNeedUp.push(i);
                }
            }
        }
    }

    if (!sIf) {
        return
    }

    list.forEach((item, index) => {

        if (notNeedUp.indexOf(index) === -1) {
            let div = document.createElement("div");
            let NewHtml = stack.html;
            stack.reactive?.forEach(s => {
                let reactiveResult = getDataWithKeyStr(s.match(/{{(.+?)}}/)[1], item, stack.direction, stack.indexStr, index)
                if (reactiveResult != "this result is not defined") {
                    NewHtml = NewHtml.replace(s, reactiveResult);
                }
            })
            if (!stack.ListNodes.length) {
                stack.comment.after(div);
                stack.ListNodes.push(div);
            } else {
                stack.ListNodes[index - 1].after(div);
                stack.ListNodes.splice(index, 0, div);
            }
            stack.attrs.forEach(s => {
                div.setAttribute(s.name, s.value);
            })
            div.innerHTML = NewHtml;

            forUpdate(div);
            ifUpdate(div, stack);
        }
    })

    stack.oldValue = list;


}


function forUpdate(el: HTMLElement) {
    function work(node) {

        node.childNodes.forEach((n, index) => {


            if (n.nodeType === 1 && !!n.getAttribute('s-for')) {
                bindSForElement(n);
            }

            if (n.nodeType === 1 && n.childNodes.length > 0) {
                work(n);
            }

        })

    }

    work(el);
}


function ifUpdate(el: HTMLElement, stack) {


    function work(node) {


        node.childNodes.forEach((n, index) => {


            if (n.nodeType === 1 && !!n.getAttribute('s-if') && !n.getAttribute('s-for')) {
                BindIfElement(n, stack);
            }
            if (n.nodeType === 1 && n.childNodes.length > 0) {
                work(n);
            }

        })

    }

    work(el);
}

function BindIfElement(n, stack) {

    console.log(stack)

    let reactiveIf = n.getAttribute('s-if')
    n.removeAttribute('s-if');
    let _display = n.style.display
    createEffect(() => {
        let state = eval2(`${reactiveIf}()`)
        if (state) {
            n.style.display = _display ? _display : ''
        } else {
            n.style.display = 'none'
        }
    })

}


function sandBox(stack, handleStr) {


}