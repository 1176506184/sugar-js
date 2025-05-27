import { sugarCompiler } from '@sugar/sugar-compiler';
import patch from './patch';
import { escape2Html } from '@sugar/sugar-shared';

import { Component } from './component';
import { effect } from '@sugar/sugar-reactive';

export { Component };

export function sugarRender () {
  let render = null;

  function mounted<T> (vm: any, data: T) {
    const serializer = new XMLSerializer();
    if (!vm.render) {
      const htmlCode = vm.render ? vm.render : escape2Html(serializer.serializeToString(vm.$el));
      const { code } = sugarCompiler(htmlCode);
      render = code;
    } else {
      render = vm.render;
    }
    pushUiEffect(vm, data);
  }

  function pushUiEffect (vm: any, data: any) {
    bindT(vm, data);
    effect(() => {
      update(vm);
    });
  }

  function update (vm: any) {
    const vmFiber: any = VmDataRefPassive(vm);
    const vnode = render.call(vmFiber);
    patch(vmFiber, vnode);
    vmFiber._vnode = vnode;
  }

  return {
    update,
    mounted
  };
}

export function VmDataRefPassive (vm: any) {
  return new Proxy(vm, {
    get (target, prop, receiver) {
      const val = Reflect.get(target, prop, receiver);
      if (isRef(val)) {
        return val.value;
      } else {
        return val;
      }
    },
    set (target, prop, newValue, receiver) {
      const val = Reflect.get(target, prop, receiver);
      if (isRef(val)) {
        val.value = newValue;
      } else {
        Reflect.set(target, prop, newValue);
      }
      return true;
    }
  });
}

function isRef (value: any) {
  return !!value.__isRef;
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
    return {
      tag: 'div',
      data: {
        attrs: {
          class: 's-block'
        },
        on: {}
      },
      children: [],
      elm: {
        _vei: {}
      }
    };
  }

  function _html (html) {
    return html2Vnode(html);
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

  vm._SUGAR = {
    _c,
    _v,
    _s,
    _e,
    _loop,
    _html
  };
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

export function html2Vnode (html) {
  function work (dom) {
    const attr = {
      attrs: {},
      on: {}
    };
    Array.from(dom.attributes).forEach((item: any) => {
      attr.attrs[item.name] = item.value;
    });
    const vNode: any = createElement(dom.tagName, attr, []);
    Array.from(dom.childNodes).forEach((child: any) => {
      if (child.nodeType === 1) {
        vNode.children.push(work(child));
      } else if (child.nodeType === 3) {
        vNode.children.push({
          tag: '',
          content: child.textContent,
          children: [],
          elm: undefined,
          text: child.textContent,
          key: undefined,
          data: undefined
        });
      }
    });
    return vNode;
  }

  const div = document.createElement('div');
  div.innerHTML = html;
  return work(div);
}
