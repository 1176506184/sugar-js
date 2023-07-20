import {createEffect} from "../signal/createEffect";
import getDataWithKeyStr from "./getDataWithKeyStr";
import ListUpdate from "./ListUpdate";
import {BindModelElement} from "./sModel";
import {BindEvent} from "../event/event";
import makeSugar from "../core";

const eval2 = eval;
export default function parse(node?, data?, appId?, type = 1) {

    window[`sugarBulk_${appId}`] = data;

    function work(node) {
        node.childNodes.forEach((n, index) => {


            if (n.nodeType === 1 && checkIsComponent(n.nodeName.toLocaleLowerCase(), appId)) {
                console.log(n.nodeName.toLocaleLowerCase())
                let componentNode = document.createElement('div');
                let componentSugar = window[`sugarBulkComponents_${appId}`].filter(c => {
                    return c.name === n.nodeName.toLocaleLowerCase();
                })[0];
                componentNode.innerHTML = componentSugar.render
                n.after(componentNode);
                n.remove();
                componentSugar.renderDom = componentNode;
                makeSugar(componentSugar)

                return;
            }

            if (type === 1) {

                if (n.nodeType === 1) {
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
                    bindSForElement(n, appId)
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
                text = text.replace(r, getDataWithKeyStr(effectKey, null, null, null, null, appId));
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
        let keys = Object.keys(window[`sugarBulk_${appId}`]).toString()
        window[`sugarValues_${appId}`] = Object.values(window[`sugarBulk_${appId}`])
        let state = eval2(`(function(${keys}){return ${reactiveIf}}).call(window['sugarBulk_${appId}'],...window['sugarValues_${appId}'])`);
        if (state) {
            n.style.display = _display ? _display : ''
        } else {
            n.style.display = 'none'
        }
    })

}


function bindSForElement(n, appId?) {
    let reactiveFor = n.getAttribute('s-for')
    n.removeAttribute('s-for');
    let directive = reactiveFor.split(' in ');
    let stack = {
        reactiveFor: reactiveFor,
        node: n,
        html: n.innerHTML,
        comment: null as any,
        reactive: n.innerHTML?.match(/{{(.+?)}}/ig),
        mounted: false,
        diffNode: null as any,
        ListNodes: [],
        update: ListUpdate,
        direction: directive[0].split(',')[0],
        if: null as any,
        attrs: [] as any[],
        oldValue: [],
        indexStr: directive[0].split(',')[1]
    }
    let comment = document.createComment('s-for')
    stack.node.before(comment);
    stack.comment = comment;
    stack.node.remove();
    if (!!n.getAttribute('s-if')) {
        stack.if = n.getAttribute('s-if')
        n.removeAttribute('s-if')
    }


    Object.keys(n.attributes).forEach(key => {
        stack.attrs.push({
            name: n.attributes[key].name,
            value: n.attributes[key].value
        })
    })


    createEffect(() => {
        let list = getDataWithKeyStr(directive[1], null, null, null, null, appId);
        // let sIf = getDataWithKeyStr(stack.if);
        ListUpdate(list, stack, appId);
    })
}

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

