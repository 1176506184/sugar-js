import { isDef, isUndef, nodeOps } from '@sugar/sugar-shared';
import { isComponent } from './utils';

export default function patch (vm, newVnode) {
  let oldVnode = vm._vnode;
  if (!oldVnode.elm) {
    oldVnode = emptyNodeAt(oldVnode);
  }

  let newDom = newVnode.elm;
  if (!newVnode.elm) {
    newDom = createElement(newVnode);
  }

  if (isSameNode(oldVnode, newVnode)) {
    patchVnode(newVnode, oldVnode);
  } else {
    if (oldVnode.elm?.parentNode && newDom) {
      nodeOps.insert(newDom, nodeOps.parentNode(oldVnode.elm), oldVnode.elm);
      nodeOps.remove(oldVnode.elm);
    }
  }

  function createElement (vnode) {
    let domNode;
    if (vnode.tag) {
      if (typeof vnode.tag === 'string' && !isComponent(vnode, vm.components)) {
        domNode = document.createElement(vnode.tag);
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
    if (oldVnode === newVnode) {
      return;
    }
    newVnode.elm = oldVnode.elm;
    if (newVnode.text) {
      if (oldVnode.text !== newVnode.text) {
        oldVnode.elm.nodeValue = newVnode.text;
      }
    } else if (newVnode.tag) {
      patchProps(newVnode, oldVnode);
      if (oldVnode.children?.length) {
        updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
      } else {
        oldVnode.elm.innerHTML = '';
        for (let i = 0; i < newVnode.children.length; i++) {
          const child = newVnode.children[i];
          const newChildDom = child.elm;
          if (newChildDom) {
            oldVnode.elm.appendChild(newChildDom);
          }
        }
      }
    }
  }

  function clearEmptyVnode (Vnodes) {
    return Vnodes.filter((Vnode) => {
      return Vnode.tag || Vnode.text === '' || Vnode.text || Vnode.elm;
    });
  }

  function patchProps (newVnode, oldVnode) {
    const {
      data,
      elm
    } = newVnode;
    const {
      attrs = {},
      on = {}
    } = data;
    const oldAttrs = oldVnode.data.attrs;
    patchAttrs(elm, oldAttrs, attrs);
    patchEvents(elm, on);
  }

  function patchAttrs (el, oldAttrs, newAttrs) {
    if (oldAttrs) {
      Object.keys(oldAttrs).forEach((attr) => {
        el.removeAttribute(attr);
      });
    }

    Object.keys(newAttrs).forEach((attr) => {
      if (attr === 'value') {
        el.value = newAttrs[attr];
      }
      el.setAttribute(attr, newAttrs[attr]);
    });
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
        // ++oldPreIndex
        // --newAftIndex
        oldSNode = oldCh[++oldPreIndex];
        newENode = newCh[--newAftIndex];
        // 新后与旧后
      } else if (isSameNode(newENode, oldENode)) {
        patchVnode(newENode, oldENode);
        // --oldAftIndex
        // --newAftIndex
        oldENode = oldCh[--oldAftIndex];
        newENode = newCh[--newAftIndex];
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldPreIndex, oldAftIndex);
        idxInOld = isDef(newSNode.key) ? oldKeyToIdx[newSNode.key] : null;
        if (isUndef(idxInOld)) {
          parentDom.insertBefore(newSNode.elm, oldSNode.elm);
          newSNode = newCh[++newPreIndex];
        } else {
          elmToMove = oldCh[idxInOld];
          if (isSameNode(elmToMove, newSNode)) {
            patchVnode(elmToMove, newSNode);
            oldCh[idxInOld] = undefined;
            parentDom.insertBefore(newSNode.elm, oldSNode.elm);
            newSNode = newCh[++newPreIndex];
          }
        }
      }
    }

    // 循环结束
    // ①如果循环结束，新节点还有剩余直接添加
    if (oldPreIndex > oldAftIndex) {
      refElm = isUndef(newCh[newAftIndex + 1]) ? null : newCh[newAftIndex + 1].elm;
      for (; newPreIndex <= newAftIndex; newPreIndex++) {
        if (refElm) {
          parentDom.insertBefore(newCh[newPreIndex].elm, refElm);
        } else {
          parentDom.append(newCh[newPreIndex].elm);
        }
      }
    }
    // ②如果循环结束，旧节点还有剩余直接删除
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

export function emptyNodeAt (elm) {
  return new VNode(elm.tagName.toLowerCase(), {}, [], elm);
}

function isSameNode (o, n) {
  return o.key === n.key && o.tag === n.tag && isDef(o.data) === isDef(n.data);
}

class VNode {
  private readonly tag: any;
  private readonly data: any;
  private readonly elm: undefined;
  private readonly context: undefined;
  private readonly text: undefined;
  private readonly key: undefined;

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
