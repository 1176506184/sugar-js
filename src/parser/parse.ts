import {createEffect} from "../signal/createEffect";
import getDataWithKeyStr from "./getDataWithKeyStr";
import ListUpdate from "./ListUpdate";
import {BindModelElement} from "./sModel";
import {BindEvent} from "../event/event";

const eval2 = eval;
export default function parse(node?, data?) {

    window['sugarBulk'] = data;

    function work(node) {
        node.childNodes.forEach((n, index) => {


            if (n.nodeType === 1) {
                BindEvent(n);
            }

            if (n.nodeType === 1 && !!n.getAttribute('s-model')) {
                BindModelElement(n);
            }

            if (n.nodeType === 3) {
                BindTextElement(n, index, node)
                return
            }

            if (n.nodeType === 8) {
                return;
            }

            if (n.nodeType === 1 && !!n.getAttribute('s-if') && !n.getAttribute('s-for')) {
                BindIfElement(n);
            }

            if (n.nodeType === 1 && !!n.getAttribute('s-for')) {
                bindSForElement(n)
                return
            }


            if (n.nodeType === 1 && n.childNodes) {
                work(n);
            }

        });
    }

    typeof node === "string" ? work(document.querySelector(node)) : work(node)
}


function BindTextElement(n, index, node) {
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
                text = text.replace(r, getDataWithKeyStr(effectKey));
            })
            stack['textNodeParent'].childNodes[stack['textNodeIndex']].textContent = text;
        })
    }
}


function BindIfElement(n) {

    let reactiveIf = n.getAttribute('s-if')
    n.removeAttribute('s-if');
    let _display = n.style.display
    createEffect(() => {
        let keys = Object.keys(window['sugarBulk']).toString()
        window['sugarValues'] = Object.values(window['sugarBulk'])
        let state = eval2(`(function(${keys}){return ${reactiveIf}}).call(window['sugarBulk'],...window['sugarValues'])`);
        if (state) {
            n.style.display = _display ? _display : ''
        } else {
            n.style.display = 'none'
        }
    })

}


function bindSForElement(n) {
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
        let list = getDataWithKeyStr(directive[1]);
        // let sIf = getDataWithKeyStr(stack.if);
        ListUpdate(list, stack);
    })
}

export {
    bindSForElement,
    BindTextElement,
    BindIfElement

}

