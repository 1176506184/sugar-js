import getDataWithKeyStr, {getDataWithKey, getDataWithKeyExtra} from "./getDataWithKeyStr";
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

    console.log(stack)

    for (let i = 0; i < list.length; i++) {

        if (stack.if) {
            if (getFirstKey(stack.if, appId) === stack.direction) {

                let key = stack.if.replaceAll(stack.direction, `${stack.directive[1]}[${i}]`);
                console.log(key, appId)
                let result = getDataWithKeyExtra(key, appId);
                console.log(result)
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

// export default function ListUpdate(list, stack, appId) {
//     const notNeedUp = [] as any[]
//
//     let sIf = true
//
//     if (stack.if) {
//         let state = getDataWithKeyStr(stack.if);
//         if (!state) {
//             sIf = false;
//             stack.oldValue = [];
//         } else {
//             sIf = true
//         }
//     }
//
//     if (!stack.mounted) {
//         stack.mounted = true;
//     } else {
//
//
//         for (let i = 0; i < stack.ListNodes.length; i++) {
//
//             if (!sIf) {
//                 stack.ListNodes[i].remove()
//             } else {
//                 if (JSON.stringify(stack.oldValue[i]) !== JSON.stringify(list[i])) {
//                     stack.ListNodes[i].remove()
//                     stack.ListNodes.splice(Number(i), 1);
//                     i--;
//                 } else {
//                     notNeedUp.push(i);
//                 }
//             }
//         }
//     }
//
//     if (!sIf) {
//         return
//     }
//
//     list.forEach((item, index) => {
//
//         if (notNeedUp.indexOf(index) === -1) {
//             let div = document.createElement("div");
//             let NewHtml = stack.html;
//             stack.reactive?.forEach(s => {
//                 let reactiveResult = getDataWithKeyStr(s.match(/{{(.+?)}}/)[1], item, stack.direction, stack.indexStr, index, appId)
//                 if (reactiveResult != "this result is not defined") {
//                     NewHtml = NewHtml.replace(s, reactiveResult);
//                 }
//             })
//             if (!stack.ListNodes.length) {
//                 stack.comment.after(div);
//                 stack.ListNodes.push(div);
//             } else {
//                 stack.ListNodes[index - 1].after(div);
//                 stack.ListNodes.splice(index, 0, div);
//             }
//             stack.attrs.forEach(s => {
//                 div.setAttribute(s.name, s.value);
//             })
//             div.innerHTML = NewHtml;
//
//             forUpdate(div, appId);
//             ifUpdate(div, stack, appId);
//         }
//     })
//
//     stack.oldValue = list;
//
//
// }
//
//

//
//
// function ifUpdate(el: HTMLElement, stack, appId) {
//
//
//     function work(node) {
//
//
//         node.childNodes.forEach((n, index) => {
//
//
//             if (n.nodeType === 1 && !!n.getAttribute('s-if') && !n.getAttribute('s-for')) {
//                 BindIfElement(n, stack, appId);
//             }
//             if (n.nodeType === 1 && n.childNodes.length > 0) {
//                 work(n);
//             }
//
//         })
//
//     }
//
//     work(el);
// }
//
// function BindIfElement(n, stack, appId) {
//
//     let reactiveIf = n.getAttribute('s-if')
//     n.removeAttribute('s-if');
//     let _display = n.style.display
//     createEffect(() => {
//         let keys = Object.keys(window['sugarBulk']).toString()
//         window[`sugarValues_${appId}`] = Object.values(window[`sugarBulk_${appId}`])
//         let state = eval2(`(function(${keys}){return ${reactiveIf}}).call(window['sugarBulk_${appId}'],...window['sugarValues_${appId}'])`);
//         if (state) {
//             n.style.display = _display ? _display : ''
//         } else {
//             n.style.display = 'none'
//         }
//     })
//
// }
//
