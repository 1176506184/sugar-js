import {nodeOps, NodeTypes} from "@sugar/sugar-shared"

export function bindAttrAndEvent(vm, vnode) {
    const {tag, data = {}, children = []} = vnode || {};
    const {attrs = {}, on = {}} = data;
    if (vnode.tag) {
        // 处理监听事件
        for (const key in on) {
            if (Object.hasOwnProperty.call(on, key)) {
                if (on[key].value && !on[key].isStatic) {
                    on[key].value = vm.data[on[key].value]
                }
            }
        }
        if (vnode.children) {
            for (let i = 0; i < vnode.children.length; i++) {
                bindAttrAndEvent(vm, vnode.children[i])
            }
        }

    }

}

export default function (oldVnode, newVnode) {


    if (!oldVnode.elm) {
        oldVnode = emptyNodeAt(oldVnode)
    }

    let newDom = newVnode.elm
    if (!newVnode.elm) {
        newDom = createElement(newVnode);
    }


    if (isSameNode(oldVnode, newVnode)) {
        patchVnode(newVnode, oldVnode)
    } else {
        if (oldVnode.elm && oldVnode.elm.parentNode && newDom) {
            nodeOps.insert(newDom, nodeOps.parentNode(oldVnode.elm), oldVnode.elm)
            nodeOps.remove(oldVnode.elm)
        }
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
                        const event = on[key].value
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

    function patchVnode(newVnode, oldVnode) {

        if (oldVnode === newVnode) {
            console.log('同节点，不更新')
            return
        }


        newVnode.elm = oldVnode.elm


        if (newVnode.text) {
            if (oldVnode.text !== newVnode.text) {
                oldVnode.elm.nodeValue = newVnode.text
            }
        } else {

            patchAttribute(newVnode, oldVnode)

            if (oldVnode.children && oldVnode.children.length) {
                // console.log('新老节点都有childrens属性', oldVnode.elm, oldVnode, newVnode)
                updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
            } else {
                oldVnode.elm.innerHTML = ''
                for (let i = 0; i < newVnode.children.length; i++) {

                    let child = newVnode.children[i]
                    const newChildDom = child.elm
                    if (newChildDom) {
                        oldVnode.elm.appendChild(newChildDom)
                    }
                }
            }

        }

    }

    function patchAttribute(newVnode, oldVnode) {

        const {tag, data = {}, children = []} = newVnode || {};
        const {attrs = {}, on = {}} = data;
        Object.keys(attrs).forEach((attr) => {
            newVnode.elm.setAttribute(attr, attrs[attr])
        })

    }

    function clearEmptyVnode(Vnodes) {

        return Vnodes.filter((Vnode) => {
            return Vnode.tag || Vnode.text === "" || Vnode.text
        })

    }

    function updateChildren(parentDom, oldCh, newCh) {


        oldCh = clearEmptyVnode(oldCh);
        newCh = clearEmptyVnode(newCh)

        // 旧前
        let oldPreIndex = 0;
        // 旧后
        let oldAftIndex = oldCh.length - 1;
        // 新前
        let newPreIndex = 0;
        // 新后
        let newAftIndex = newCh.length - 1;
        // 旧前节点
        let oldSNode = oldCh[oldPreIndex];
        // 旧后节点
        let oldENode = oldCh[oldAftIndex];
        // 新前节点
        let newSNode = newCh[newPreIndex];
        // 新后节点
        let newENode = newCh[newAftIndex];

        while (oldPreIndex <= oldAftIndex && newPreIndex <= newAftIndex) {

            console.log(oldPreIndex, oldSNode)
            // 新前与旧前
            if (!oldSNode || !oldCh[oldPreIndex]) {
                console.log('旧前为空，旧前向后移动')
                oldSNode = oldCh[++oldPreIndex]
            } else if (!oldENode || !oldCh[oldAftIndex]) {
                console.log('旧后为空，旧后向前移动')
                oldENode = oldCh[--oldAftIndex]
            } else if (!newSNode || !newCh[newPreIndex]) {
                console.log('新前为空，新前向后移动')
                newSNode = newCh[++newPreIndex]
            } else if (!newENode || !newCh[newAftIndex]) {
                console.log('新后为空，新后向前移动')
                newENode = newCh[--newAftIndex]
            } else if (isSameNode(newSNode, oldSNode)) {
                console.log('①新前与旧前', newSNode, oldSNode)
                patchVnode(newSNode, oldSNode)
                oldSNode = oldCh[++oldPreIndex]
                newSNode = newCh[++newPreIndex]
                // 新前与旧后
            } else if (isSameNode(newSNode, oldENode)) {
                console.log('②新前与旧后', newSNode, oldENode)
                patchVnode(newSNode, oldENode)
                parentDom.insertBefore(oldENode.elm, oldSNode.elm)
                oldENode = oldCh[--oldAftIndex]
                newSNode = newCh[++newPreIndex]
                // 新后与旧前
            } else if (isSameNode(newENode, oldSNode)) {

                console.log('③新后与旧前', newENode.elm, oldSNode.elm)
                patchVnode(newENode, oldSNode)
                parentDom.insertBefore(oldSNode.elm, oldENode.elm.nextSibling)
                // ++oldPreIndex
                // --newAftIndex
                oldSNode = oldCh[++oldPreIndex]
                newENode = newCh[--newAftIndex]
                // 新后与旧后
            } else if (isSameNode(newENode, oldENode)) {

                console.log('④新后与旧后', newENode, oldENode)
                patchVnode(newENode, oldENode)
                // --oldAftIndex
                // --newAftIndex
                oldENode = oldCh[--oldAftIndex]
                newENode = newCh[--newAftIndex]


            } else {
                console.log('⑤未匹配到相同的情况下')
                let keyMap = {}
                // 未匹配到相同的情况下
                for (let i = oldPreIndex; i < oldAftIndex; i++) {
                    if (oldCh[i]) {
                        keyMap[oldCh[i].key] = i
                    }
                }
                const target = keyMap[newSNode.key]
                // 如果存在则移动
                if (target !== undefined) {
                    console.log('⑤未匹配到相同的情况下-存在-移动', newSNode.text)
                    patchVnode(oldCh[target], newSNode)
                    parentDom.insertBefore(oldCh[target].elm, oldSNode.elm)
                    oldCh[target] = undefined;
                } else {
                    console.log('⑤未匹配到相同的情况下-不存在-添加', newSNode, oldSNode)
                    // 如不存在则新增
                    parentDom.insertBefore(newSNode.elm, oldSNode.elm)
                }
                newSNode = newCh[++newPreIndex]
            }
        }


        console.log("剩余旧节点结束", oldSNode, oldPreIndex, oldCh, newCh)

        // 循环结束
        // ①如果循环结束，新节点还有剩余直接添加
        if (newPreIndex <= newAftIndex) {

            console.log(`⑥循环完毕-新节点剩余--new--${newPreIndex}--add--${newAftIndex}`)
            for (let i = newPreIndex; i <= newAftIndex; i++) {
                // console.log(parentDom, newCh[i].elm, oldSNode.elm)
                // console.log(newCh[i], oldSNode)
                parentDom.insertBefore(newCh[i].elm, oldENode.elm)
            }
        }
        // ②如果循环结束，旧节点还有剩余直接删除
        if (oldPreIndex <= oldAftIndex) {
            console.log('⑥循环完毕-旧节点剩余--old--delete')
            for (let i = oldPreIndex; i <= oldAftIndex; i++) {
                if (oldCh[i] && oldCh[i].elm) {
                    console.log('delete...', oldCh[i].text, 'index:', i)
                    parentDom.removeChild(oldCh[i].elm)
                }
            }
        }

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
    private key: undefined

    constructor(tag?, data?, children?, elm?) {
        this.tag = tag;
        this.data = data;
        // @ts-ignore
        this.children = children;
        this.key = data.attrs?.key;
        this.elm = elm;
        this.context = undefined;
        this.text = undefined;
    }
}