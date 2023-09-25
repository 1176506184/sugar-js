import { sugarCompiler } from '@sugar/sugar-compiler';
import { createEffect } from '@sugar/sugar-reactive';
import patchEx from './patch';
import { escape2Html } from '@sugar/sugar-shared';

export function sugarRender () {
  let render = null;

  function mounted (vm, el, data) {
    if (!(el instanceof HTMLElement)) {
      el = document.querySelector(el);
    }
    vm.$el = el;
    vm._vnode = el;
    const serializer = new XMLSerializer();
    const htmlCode = vm.render ? vm.render : escape2Html(serializer.serializeToString(vm.$el));
    const { code } = sugarCompiler(htmlCode);
    render = code;
    bindT(vm, data);
    update(vm);
    vm.forceUpdate = function () {
      update(vm);
    };
  }

  function update (vm) {
    createEffect(() => {
      const vnode = render.call(vm);
      bindAttrAndEvent(vm, vnode);
      patchEx(vm, vnode);
      vm._vnode = vnode;
    });
  }

  return {
    update,
    mounted
  };
}

export function bindT (vm, data) {
  Object.keys(data).forEach((key) => {
    vm[key] = data[key];
  });

  function _c (tag = 'div', data = {}, children = []) {
    return createElement(tag, data, children);
  }

  function _v (str) {
    const vnode: any = new VNode();
    vnode.text = str;
    return vnode;
  }

  function _s (val) {
    return String(val);
  }

  function _e () {
    return new VNode();
  }

  function _loop (fun: Function, data: any) {
    const nodes = [];
    data.forEach((item, index) => {
      nodes.push({
        ...fun(item, index)
      });
    });
    return nodes;
  }

  vm._c = _c;
  vm._v = _v;
  vm._s = _s;
  vm._e = _e;
  vm._loop = _loop;
}

export function createElement (tag = 'div', data = {}, children = []) {
  const createVNode = (tag = 'div', data = {}, children = []) => {
    const vnodeChildren = [];

    if (children && (children.length > 0)) {
      children.forEach((child) => {
        vnodeChildren.push(child);
      });
    }
    return new VNode(tag, data, vnodeChildren);
  };

  // render函数中执行_c，接收参数，创建vnode
  return createVNode(tag, data, children);
}

export class VNode {
  private readonly tag: any;
  private readonly data: any;
  private readonly elm: undefined;
  private readonly context: undefined;
  private readonly text: undefined;
  private readonly key: undefined;
  private readonly sugar: any;

  constructor (tag?, data?, children?) {
    this.tag = tag;
    this.data = data;
    // @ts-expect-error
    this.children = children;
    this.elm = undefined;
    this.context = undefined;
    this.text = undefined;
    this.key = data?.attrs?.key;
  }
}

export function bindAttrAndEvent (vm, vnode) {
  if (vnode.static) {
    return;
  }

  const {
    data = {}
  } = vnode || {};
  const {
    on = {}
  } = data;
  if (vnode?.tag) {
    // 处理监听事件
    for (const key in on) {
      if (Object.hasOwnProperty.call(on, key)) {
        if (on[key].value && !on[key].isStatic) {
          on[key].value = vm.data[on[key].value];
          on[key].fun = function (e) {
            const parameters = on[key].parameters;
            if (parameters?.length) {
              on[key].value(...parameters);
            } else {
              on[key].value(e);
            }
          };
        } else {
          on[key].fun = on[key].value;
        }
      }
    }
    if (vnode.children) {
      for (let i = 0; i < vnode.children.length; i++) {
        if (vnode.children[i].appId) {
          bindAttrAndEvent(vm.sugar[vnode.children[i].appId].vm, vnode.children[i]);
        } else {
          bindAttrAndEvent(vm, vnode.children[i]);
        }
      }
    }
  }
}
