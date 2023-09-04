import {sugarCompiler} from "@sugar/sugar-compiler";
import {createEffect} from "../../../src/main";
import patchEx, {bindAttrAndEvent} from "./patch";
import {escape2Html} from "@sugar/sugar-shared";

export function sugarRender() {

    let render = null
    let components = []

    function mounted(vm, el, data) {
        if (!(el instanceof HTMLElement)) {
            el = document.querySelector(el);
        }
        vm.$el = el
        vm._vnode = el
        components = vm.components

        var serializer = new XMLSerializer();
        var htmlCode = escape2Html(serializer.serializeToString(vm.$el));

        render = sugarCompiler(htmlCode, components, data);
        console.log(render)
        updateComponent(vm, el, data);


    }

    function updateComponent(vm, el, data) {
        function update(vm, el) {

            Object.keys(data).forEach((key) => {
                vm[key] = data[key]
            })

            bindT(vm)

            createEffect(() => {
                const vnode = render.call(vm);
                bindAttrAndEvent(vm, vnode)
                patchEx(vm._vnode, vnode);
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
        let nodes = []
        data.forEach((item, index) => {
            nodes.push({
                ...fun(item)
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
    private key: undefined;

    constructor(tag?, data?, children?) {
        this.tag = tag;
        this.data = data;
        // @ts-ignore
        this.children = children;
        this.elm = undefined;
        this.context = undefined;
        this.text = undefined;
        this.key = data?.attrs?.key
    }
}

