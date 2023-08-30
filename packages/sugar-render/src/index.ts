import {sugarCompiler} from "@sugar/sugar-compiler";
import {createEffect} from "../../../src/main";
import patchEx from "./patch";

export function sugarRender() {

    let render = null
    let components = []

    function mounted(vm, el, data) {
        if (!(el instanceof HTMLElement)) {
            el = document.querySelector(el);
        }
        vm.$el = el
        components = vm.components
        render = sugarCompiler(el.outerHTML, components, data);
        updateComponent(vm, el, data);


    }

    function updateComponent(vm, el, data) {
        function update(vm, el) {


            function patch(vm, oldVNode, vnode, parentElm) {
                if (!parentElm) {
                    parentElm = document.body;
                }
                if (!oldVNode) {
                    oldVNode = vm.$el;
                    oldVNode = new VNode(oldVNode.tagName.toLowerCase(), {}, []);
                    oldVNode.elm = vm.$el;
                }

                // 根据vnode创建真实的dom，处理属性、事件、静态文本、创建子元素等
                const createElm = (vnode, parentElm) => {
                    const {tag, data = {}, children = []} = vnode || {};
                    if (tag) {
                        const elm = document.createElement(tag);
                        const {attrs = {}, on = {}} = data;
                        // 处理属性
                        for (const key in attrs) {
                            if (Object.hasOwnProperty.call(attrs, key)) {
                                const value = attrs[key];
                                elm.setAttribute(key, value);
                            }
                        }

                        // 处理监听事件
                        for (const key in on) {
                            if (Object.hasOwnProperty.call(on, key)) {
                                if (on[key].value) {
                                    const event = vm.data[on[key].value]
                                    event && elm.addEventListener(key, event)
                                }
                            }
                        }
                        // 处理子元素
                        if (children && children.length) {
                            children.forEach((childVNode) => {
                                createElm(childVNode, elm);
                            });
                        }
                        vnode.elm = elm;
                        // 移除文档上的旧节点
                        parentElm.appendChild(elm);
                    } else if (vnode.text) {

                        let textNode;
                        // 处理静态文本
                        textNode = document.createTextNode(vnode.text);
                        parentElm.appendChild(textNode);
                    } else if (children) {
                        children.forEach((child) => {
                            createElm(child, parentElm);
                        })
                    }
                };

                createElm(vnode, parentElm);
                parentElm.removeChild(oldVNode.elm);

            }


            Object.keys(data).forEach((key) => {
                vm[key] = data[key]
            })


            bindT(vm)

            createEffect(() => {
                const vnode = render.call(vm);
                patchEx(vm, vnode);

                // 将vnode转成真实的DOM元素
                // patch(vm, vm._vnode, vnode, null);

                // 保存旧的vnode
                vm._vnode = vnode;

            })

        }

        update(vm, el);

    }


    return {
        updateComponent,
        mounted
    }

}


function bindT(vm) {

    // vm._vnode = emptyNodeAt(vm.$el)

    function _c(tag = "div", data = {}, children = []) {
        return createElement(tag, data, children)
    }

    function _v(str) {
        // @ts-ignore
        const vnode: any = new VNode();
        vnode.text = str;
        return vnode;
    }

    function _s(val) {
        return String(val);
    }

    function _e() {
        // @ts-ignore
        return new VNode();
    }

    function _for(fun: Function, data: any) {

        // const vnode: any = new VNode();
        // vnode.children = []
        // data.forEach((item, index) => {
        //     vnode.children.push({
        //         ...fun(item),
        //         key: index
        //     });
        // })
        let nodes = []
        data.forEach((item, index) => {
            nodes.push({
                ...fun(item),
                key: index
            });
        })
        return nodes;
    }

    vm._c = _c;
    vm._v = _v;
    vm._s = _s;
    vm._e = _e;
    vm._for = _for;

}

function createElement(tag = "div", data = {}, children = []) {
    const createVNode = (tag = "div", data = {}, children = []) => {
        const vnodeChildren = [];

        if (children && children.length) {
            children.forEach((child) => {
                vnodeChildren.push(child);
            });
        }
        return new VNode(tag, data, vnodeChildren);
    };

    // render函数中执行_c，接收参数，创建vnode
    return createVNode(tag, data, children);
}


class VNode {
    private tag: any;
    private data: any;
    private elm: undefined;
    private context: undefined;
    private text: undefined;

    constructor(tag?, data?, children?) {
        this.tag = tag;
        this.data = data;
        // @ts-ignore
        this.children = children;
        this.elm = undefined;
        this.context = undefined;
        this.text = undefined;
    }
}

