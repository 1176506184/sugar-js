import {createEffect} from "../signal/createEffect";
import {getDataWithKey, getDataWithKeyExtra} from "./getDataWithKeyStr";
import ListUpdate from "./ListUpdate";
import {BindModelElement} from "./sModel";
import {BindEvent} from "../event/event";
import makeSugar from "../core";
import {guid} from "../utils/guid";
import parseComponents from "./parseComponents"
import deepClone from "../utils/deepClone";
import bindSForElement from "./forMatch";

const eval2 = eval;
export default function parse(node?, data?, appId?, type = 1) {

    if(data){
        window[`sugarBulk_${appId}`] = data;
    }


    function work(node) {
        node.childNodes.forEach((n, index) => {


            if (n.nodeType === 1 && checkIsComponent(n.nodeName.toLocaleLowerCase(), appId) && !n.getAttribute('s-for')) {
                parseComponents(n, appId)
                return;
            }

            if (type === 1) {

                if (n.nodeType === 1 && !n.getAttribute('s-for')) {
                    BindEvent(n, appId);
                }

                if (n.nodeType === 1 && !!n.getAttribute('s-model')) {
                    BindModelElement(n, appId);
                }

                if (n.nodeType === 3) {
                    BindTextElement(n, index, node, appId)
                    return
                }

                if (n.nodeType === 8) {
                    return;
                }

                if (n.nodeType === 1 && !!n.getAttribute('s-if') && !n.getAttribute('s-for')) {
                    BindIfElement(n, appId);
                }

                if (n.nodeType === 1 && !!n.getAttribute('s-for')) {
                    bindSForElement(n, appId, data)
                    return
                }
            }

            if (n.nodeType === 1 && n.childNodes) {
                work(n);
            }

        });
    }

    typeof node === "string" ? work(document.querySelector(node)) : work(node)
}


function BindTextElement(n, index, node, appId?) {
    let stack = {
        keystore: n.textContent.toString(),
        reactive: n.textContent?.match(/{{(.+?)}}/ig),
        textNodeParent: node,
        textNodeIndex: index
    }
    if (stack.reactive) {


        createEffect(() => {
            let text = stack.keystore;

            stack.reactive.forEach(r => {
                let effectKey = r.match(/{{(.+?)}}/)[1];

                text = text.replace(r, getDataWithKey(effectKey, appId));

            })
            stack['textNodeParent'].childNodes[stack['textNodeIndex']].textContent = text;
        })
    }
}


function BindIfElement(n, appId?) {

    let reactiveIf = n.getAttribute('s-if')
    n.removeAttribute('s-if');
    let _display = n.style.display
    createEffect(() => {
        let state = getDataWithKeyExtra(reactiveIf, appId);
        if (state) {
            n.style.display = _display ? _display : ''
        } else if (!state) {
            n.style.display = 'none'
        }
    })

}



//
// function bindSForElement(n, appId?, data?: any) {
//     let reactiveFor = n.getAttribute('s-for')
//     n.removeAttribute('s-for');
//     let directive = reactiveFor.split(' in ');
//     let stack = {
//         reactiveFor: reactiveFor,
//         node: n,
//         html: n.outerHTML,
//         comment: null as any,
//         reactive: n.innerHTML?.match(/{{(.+?)}}/ig) ? n.innerHTML?.match(/{{(.+?)}}/ig) : [],
//         mounted: false,
//         diffNode: null as any,
//         ListNodes: [],
//         update: ListUpdate,
//         direction: directive[0].split(',')[0],
//         if: null as any,
//         attrs: [] as any[],
//         oldValue: [],
//         indexStr: directive[0].split(',')[1],
//         directive: directive
//     }
//     let comment = document.createComment('s-for')
//     stack.node.before(comment);
//     stack.comment = comment;
//     stack.node.remove();
//     if (!!n.getAttribute('s-if')) {
//         stack.if = n.getAttribute('s-if')
//         n.removeAttribute('s-if')
//     }
//
//
//     Object.keys(n.attributes).forEach(key => {
//         stack.attrs.push({
//             name: n.attributes[key].name,
//             value: n.attributes[key].value
//         })
//     })
//
//
//     createEffect(() => {
//         let list = getDataWithKey(directive[1], appId);
//         ListUpdate(list, stack, appId, data);
//     })
// }
//


function checkIsComponent(name, appId) {
    return window[`sugarBulkComponents_${appId}`].filter(c => {
        return c.name === name;
    }).length > 0;

}

export {
    bindSForElement,
    BindTextElement,
    BindIfElement

}

