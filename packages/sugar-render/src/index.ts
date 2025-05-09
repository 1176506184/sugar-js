import { sugarCompiler } from '@sugar/sugar-compiler';
import patch from './patch';
import { escape2Html } from '@sugar/sugar-shared';

export function sugarRender () {
  let render = null;

  function mounted<T> (vm: any, data: T) {
    const serializer = new XMLSerializer();
    const htmlCode = vm.render ? vm.render : escape2Html(serializer.serializeToString(vm.$el));
    const { code } = sugarCompiler(htmlCode);
    render = code;
    pushUiEffect(vm, data);
  }

  function pushUiEffect (vm: any, data: any) {
    bindT(vm, data);
    Object.values(data).filter((item: any) => typeof item === 'object' && item?.sugarRefDataType === 'useState').forEach((item: any) => {
      item.initDep(() => {
        update(vm);
      });
    });
    vm.forceUpdate = function () {
      update(vm);
    };
    update(vm);
  }

  function update (vm: any) {
    const vmFiber: any = VmDataRefPassive(vm);
    const vnode = render.call(vmFiber);
    bindAttrAndEvent(vmFiber, vnode);
    patch(vmFiber, vnode);
    vmFiber._vnode = vnode;
  }

  return {
    update,
    mounted
  };
}

export function VmDataRefPassive (vm: any) {
  const refObj = {};
  Object.keys(vm).forEach((key) => {
    if (vm[key]?.sugarRefDataType === 'useState') {
      Object.defineProperty(refObj, key, {
        get () {
          return vm[key].value;
        },
        set (val) {
          console.log('useState can not set value in render');
        }
      });
    } else {
      Object.defineProperty(refObj, key, {
        get () {
          return vm[key];
        },
        set (val) {
          vm[key] = val;
        }
      });
    }
  });
  return refObj;
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
            if (on[key].modifiers.includes('self')) {
              if (e.target !== e.currentTarget) {
                return;
              }
            }
            const parameters = on[key].parameters;
            if (parameters?.length) {
              on[key].value(...parameters);
            } else {
              if (e.target?.nodeType === 1 && on[key].value?.sugarRefDataType === 'setState') {
                on[key].value(e.target.value);
              } else {
                on[key].value(e);
              }
            }

            if (on[key].modifiers.includes('stop')) {
              e.stopPropagation();
            }

            if (on[key].modifiers.includes('prevent')) {
              e.preventDefault();
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
