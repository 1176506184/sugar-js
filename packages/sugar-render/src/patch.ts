import { isDef, isUndef, nodeOps } from '@sugar/sugar-shared';
import { isComponent } from './utils';
import { bulkComponent } from './component';

export default function patch (vm, newVnode) {
  let oldVnode = vm._vnode;
  if (!oldVnode.elm) {
    oldVnode = emptyNodeAt(oldVnode);
  }

  if (isSameNode(oldVnode, newVnode)) {
    patchVnode(newVnode, oldVnode);
  } else {
    if (oldVnode.elm?.parentNode && newVnode) {
      nodeOps.insert(createElement(newVnode), nodeOps.parentNode(oldVnode.elm), oldVnode.elm);
      nodeOps.remove(oldVnode.elm);
    }
  }

  function createElement (vnode: any) {
    let domNode;
    if (vnode.tag) {
      if (typeof vnode.tag === 'string' && !isComponent(vnode, vm.components)) {
        if (vnode.tag === 'svg' || vnode.tag === 'path') {
          domNode = document.createElementNS('http://www.w3.org/2000/svg', vnode.tag);
        } else {
          domNode = document.createElement(vnode.tag);
        }

        const {
          data = {}
        } = vnode || {};

        const {
          attrs = {},
          on = {}
        } = data;
        // 处理属性
        for (const key in attrs) {
          if (Object.hasOwnProperty.call(attrs, key)) {
            const value = attrs[key];
            domNode.setAttribute(key, value);
            if (key === 'instance') {
              if (vm[value]) { vm[value].value = domNode; }
            }
          }
        }
        const _vei = domNode._vei || (domNode._vei = {});
        // 处理监听事件
        for (const key in on) {
          if (Object.hasOwnProperty.call(on, key)) {
            if (on[key].value) {
              const event = on[key].fun;
              event && domNode.addEventListener(key, event);
              _vei[key] = event;
            }
          }
        }
        if (vnode.children) {
          for (let i = 0; i < vnode.children.length; i++) {
            const childrenDom = createElement(vnode.children[i]);
            if (childrenDom) {
              domNode.append(childrenDom);
            }
          }
        }
      } else if (isComponent(vnode, vm.components)) {
        const app = bulkComponent(vnode, vm.components[vnode.tag]);
        vnode.elm = app.vm.$el;
        vnode._sugar = app;
        domNode = vnode.elm;
      }
    } else if (vnode.text !== undefined) {
      domNode = document.createTextNode(vnode.text);
    } else if (vnode.elm !== undefined) {
      domNode = vnode.elm;
    }
    vnode.elm = domNode;
    return domNode;
  }

  function patchVnode (newVnode, oldVnode) {
    if (isComponent(newVnode, vm.components)) {
      updateComponent(newVnode, oldVnode);
      bindComponentInstance(newVnode, vm);
      return;
    }
    newVnode.elm = oldVnode.elm;
    if (newVnode.text) {
      if (oldVnode.text !== newVnode.text) {
        oldVnode.elm.nodeValue = newVnode.text;
      }
    } else if (newVnode.tag) {
      patchProps(newVnode, oldVnode, vm);
      if (oldVnode.children?.length) {
        updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
      } else if (newVnode.children.length > 0) {
        oldVnode.elm.innerHTML = '';
        for (let i = 0; i < newVnode.children.length; i++) {
          const child = createElement(newVnode.children[i]);
          if (child) {
            oldVnode.elm.appendChild(child);
          }
        }
      }
    }
  }

  function patchProps (newVnode, oldVnode, vm) {
    const attrs = newVnode.data.attrs;
    const on = newVnode.data.on;
    const oldAttrs = oldVnode.data.attrs;
    const elm = newVnode.elm;
    patchAttrs(elm, oldAttrs, attrs, vm);
    patchEvents(elm, on);
  }

  function patchAttrs (el, oldAttrs, newAttrs, vm) {
    if (oldAttrs) {
      Object.keys(oldAttrs).forEach((attr) => {
        if (newAttrs[attr] !== oldAttrs[attr]) {
          el.removeAttribute(attr);
        }
      });
    }

    Object.keys(newAttrs).forEach((attr) => {
      if (attr === 'value') {
        el.value = newAttrs[attr];
      }
      if (!oldAttrs || newAttrs[attr] !== oldAttrs[attr]) {
        el.setAttribute(attr, newAttrs[attr]);
      }

      if (attr === 'instance') {
        console.log(newAttrs[attr]);
        if (vm[newAttrs[attr]]) { vm[newAttrs[attr]].value = el; }
      }
    });
  }

  function updateChildren (parentDom, oldCh, newCh) {
    oldCh = clearEmptyVnode(oldCh);
    newCh = clearEmptyVnode(newCh);

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

    let oldKeyToIdx, idxInOld, elmToMove, refElm;

    while (oldPreIndex <= oldAftIndex && newPreIndex <= newAftIndex) {
      if (!oldSNode || !oldCh[oldPreIndex]) {
        oldSNode = oldCh[++oldPreIndex];
      } else if (!oldENode || !oldCh[oldAftIndex]) {
        oldENode = oldCh[--oldAftIndex];
      } else if (!newSNode || !newCh[newPreIndex]) {
        newSNode = newCh[++newPreIndex];
      } else if (!newENode || !newCh[newAftIndex]) {
        newENode = newCh[--newAftIndex];
      } else if (isSameNode(newSNode, oldSNode)) {
        patchVnode(newSNode, oldSNode);
        oldSNode = oldCh[++oldPreIndex];
        newSNode = newCh[++newPreIndex];
        // 新前与旧后
      } else if (isSameNode(newSNode, oldENode)) {
        patchVnode(newSNode, oldENode);
        parentDom.insertBefore(oldENode.elm, oldSNode.elm);
        oldENode = oldCh[--oldAftIndex];
        newSNode = newCh[++newPreIndex];
        // 新后与旧前
      } else if (isSameNode(newENode, oldSNode)) {
        patchVnode(newENode, oldSNode);
        parentDom.insertBefore(oldSNode.elm, oldENode.elm.nextSibling);
        oldSNode = oldCh[++oldPreIndex];
        newENode = newCh[--newAftIndex];
        // 新后与旧后
      } else if (isSameNode(newENode, oldENode)) {
        patchVnode(newENode, oldENode);
        oldENode = oldCh[--oldAftIndex];
        newENode = newCh[--newAftIndex];
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldPreIndex, oldAftIndex);
        idxInOld = isDef(newSNode.key) ? oldKeyToIdx[newSNode.key] : null;
        if (isUndef(idxInOld)) {
          parentDom.insertBefore(createElement(newSNode), oldSNode.elm);
          newSNode = newCh[++newPreIndex];
        } else {
          elmToMove = oldCh[idxInOld];
          if (isSameNode(elmToMove, newSNode)) {
            patchVnode(newSNode, elmToMove);
            oldCh[idxInOld] = undefined;
            parentDom.insertBefore(elmToMove.elm, oldSNode.elm);
          } else {
            parentDom.insertBefore(createElement(newSNode), oldSNode.elm);
          }

          newSNode = newCh[++newPreIndex];
        }
      }
    }

    if (oldPreIndex > oldAftIndex) {
      refElm = isUndef(newCh[newAftIndex + 1]) ? null : newCh[newAftIndex + 1].elm;
      for (; newPreIndex <= newAftIndex; newPreIndex++) {
        if (refElm) {
          parentDom.insertBefore(createElement(newCh[newPreIndex]), refElm);
        } else {
          parentDom.append(createElement(newCh[newPreIndex]));
        }
      }
    }

    if (newPreIndex > newAftIndex) {
      for (let i = oldPreIndex; i <= oldAftIndex; i++) {
        if (oldCh[i]?.elm) {
          parentDom.removeChild(oldCh[i].elm);
        }
      }
    }
  }

  function createKeyToOldIdx (children, beginIdx, endIdx) {
    let i, key;
    const map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) map[key] = i;
    }
    return map;
  }
}

export function updateComponent (newVnode: any, oldVnode: any) {
  Object.keys(oldVnode._sugar.vm.props).forEach(prop => {
    const {
      attrs,
      on
    } = newVnode.data;
    if (Object.keys(attrs).includes(prop)) {
      oldVnode._sugar.vm.props[prop + '_sugar_setState'](newVnode.data.attrs[prop]);
    } else if (Object.keys(on).includes(prop)) {
      if (newVnode.data.on[prop].parameters) {
        oldVnode._sugar.vm.props[prop] = function () {
          newVnode.data.on[prop].fun(...newVnode.data.on[prop].parameters);
        };
      } else {
        oldVnode._sugar.vm.props[prop] = newVnode.data.on[prop].fun;
      }
    }
  });
  oldVnode._sugar.updateSlot(newVnode.children);
  if (oldVnode._sugar) {
    oldVnode._sugar.forceUpdate();
  }
  newVnode.elm = oldVnode.elm;
  newVnode._sugar = oldVnode._sugar;
}

export function emptyNodeAt (elm) {
  return new VNode(elm.tagName.toLowerCase(), {}, [], elm);
}

function isSameNode (o, n) {
  return o.key === n.key && o.tag === n.tag;
}

function patchEvents (el, newOn) {
  const _vei = el._vei || (el._vei = {});
  Object.keys(_vei).forEach((eventName) => {
    el.removeEventListener(eventName, _vei[eventName]);
  });
  Object.keys(newOn).forEach((eventName) => {
    _vei[eventName] = newOn[eventName].fun;
    el.addEventListener(eventName, newOn[eventName].fun);
  });
}

function clearEmptyVnode (Vnodes) {
  return Vnodes.filter((Vnode) => {
    return Vnode.tag || Vnode.text === '' || Vnode.text || Vnode.elm;
  });
}

function bindComponentInstance (vNode: any, vm: any) {
  const data = vNode.data;
  if (data) {
    const attrs = data.attrs;
    if (attrs.instance) {
      vm[attrs.instance].value = vNode.elm;
    }
  }
  if (vNode.children) {
    vNode.children.forEach((child: any) => {
      bindComponentInstance(child, vm);
    });
  }
}

class VNode {
  private readonly tag: any;
  private readonly data: any;
  private readonly elm: undefined;
  private readonly context: undefined;
  private readonly text: undefined;
  private readonly key: undefined;
  private readonly _sugar: undefined;

  constructor (tag?, data?, children?, elm?) {
    this.tag = tag;
    this.data = data;
    // @ts-expect-error
    this.children = children;
    this.key = data.attrs?.key;
    this.elm = elm;
    this.context = undefined;
    this.text = undefined;
  }
}
