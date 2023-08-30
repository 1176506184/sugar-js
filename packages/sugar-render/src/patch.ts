import {nodeOps, NodeTypes} from "@sugar/sugar-shared"

export default function (vm, newVnode) {

    let oldVnode = vm._vnode ? vm._vnode : vm.$el

    if (!oldVnode.elm) {
        oldVnode = emptyNodeAt(oldVnode)
    }


    if (newVnode.text !== "" && newVnode.text !== undefined) {

    } else {

    }

    let newDom = createElement(newVnode)
    // if (isSameNode(oldVnode, newVnode)) {
    //
    // } else {
    //     if (oldVnode.elm && oldVnode.elm.parentNode && newDom) {
    //         nodeOps.insert(newDom, nodeOps.parentNode(oldVnode.elm), oldVnode.elm)
    //         nodeOps.remove(oldVnode)
    //     }
    // }


    if (oldVnode.elm && oldVnode.elm.parentNode && newDom) {
        nodeOps.insert(newDom, nodeOps.parentNode(oldVnode.elm), oldVnode.elm)
        nodeOps.remove(oldVnode.elm)
    }

    function createElement(vnode) {
        let domNode
        if (vnode.tag) {
            domNode = document.createElement(vnode.tag)
            const {tag, data = {}, children = []} = vnode || {};

            const {attrs = {}, on = {}} = data;
            // 处理属性
            for (const key in attrs) {
                if (Object.hasOwnProperty.call(attrs, key)) {
                    const value = attrs[key];
                    domNode.setAttribute(key, value);
                }
            }

            // 处理监听事件
            for (const key in on) {
                if (Object.hasOwnProperty.call(on, key)) {
                    if (on[key].value) {
                        const event = vm.data[on[key].value]
                        event && domNode.addEventListener(key, event)
                    }
                }
            }

            if (vnode.children) {
                for (let i = 0; i < vnode.children.length; i++) {
                    let childrenDom = createElement(vnode.children[i]);
                    if (childrenDom) {
                        domNode.append(childrenDom)
                    }
                }
            }
        } else if (vnode.text !== undefined) {
            domNode = document.createTextNode(vnode.text)
        }
        vnode.elm = domNode
        return domNode
    }

}

export function emptyNodeAt(elm) {
    return new VNode(elm.tagName.toLowerCase(), {}, [], elm);
}


function isSameNode(o, n) {
    return o.key === n.key && o.tag === n.tag
}


class VNode {
    private tag: any;
    private data: any;
    private elm: undefined;
    private context: undefined;
    private text: undefined;

    constructor(tag?, data?, children?, elm?) {
        this.tag = tag;
        this.data = data;
        // @ts-ignore
        this.children = children;
        this.elm = elm;
        this.context = undefined;
        this.text = undefined;
    }
}