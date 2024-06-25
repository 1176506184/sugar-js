// import { isComponent } from './utils';
// import { mountComponent, updateComponent } from './patch';
// import { nodeOps } from '@sugar/sugar-shared';
//
// export function patchFiber (vm, fiber) {
//   const patchFiberState = {
//     oldPatching: null,
//     newPatching: null
//   };
//   let oldFiber = vm._fiber;
//   if (!oldFiber.ref) {
//     oldFiber = emptyFiberAt(oldFiber);
//   }
//   if (isSameFiber(oldFiber, fiber)) {
//     patchFiber(oldFiber, fiber);
//   } else {
//     if (oldFiber.ref.elm?.parentNode && fiber.ref) {
//       nodeOps.insert(createElement(fiber.ref), nodeOps.parentNode(oldFiber.ref.elm), oldFiber.ref.elm);
//       nodeOps.remove(oldFiber.ref.elm);
//     }
//   }
//
//   function createElement (vnode: any) {
//     let domNode;
//     if (vnode.tag) {
//       if (typeof vnode.tag === 'string' && !isComponent(vnode, vm.components)) {
//         domNode = document.createElement(vnode.tag);
//         const {
//           data = {}
//         } = vnode || {};
//
//         const {
//           attrs = {},
//           on = {}
//         } = data;
//         // 处理属性
//         for (const key in attrs) {
//           if (Object.hasOwnProperty.call(attrs, key)) {
//             const value = attrs[key];
//             domNode.setAttribute(key, value);
//           }
//         }
//         const _vei = domNode._vei || (domNode._vei = {});
//         // 处理监听事件
//         for (const key in on) {
//           if (Object.hasOwnProperty.call(on, key)) {
//             if (on[key].value) {
//               const event = on[key].fun;
//               event && domNode.addEventListener(key, event);
//               _vei[key] = event;
//             }
//           }
//         }
//         if (vnode.children) {
//           for (let i = 0; i < vnode.children.length; i++) {
//             const childrenDom = createElement(vnode.children[i]);
//             if (childrenDom) {
//               domNode.append(childrenDom);
//             }
//           }
//         }
//       } else if (isComponent(vnode, vm.components)) {
//         const app = mountComponent(vnode, vm.components[vnode.tag]);
//         vnode.elm = app.vm.$el;
//         vnode._sugar = app;
//         domNode = vnode.elm;
//       }
//     } else if (vnode.text !== undefined) {
//       domNode = document.createTextNode(vnode.text);
//     } else if (vnode.elm !== undefined) {
//       domNode = vnode.elm;
//     }
//     vnode.elm = domNode;
//     return domNode;
//   }
//
//   function patchFiber (oldFiber, newFiber) {
//     const newVnode = newFiber.ref;
//     const oldVnode = oldFiber.ref;
//     if (isComponent(newVnode, vm.components)) {
//       updateComponent(newVnode, oldVnode);
//       return;
//     }
//     newVnode.elm = oldVnode.elm;
//     if (newVnode.text) {
//       if (oldVnode.text !== newVnode.text) {
//         oldVnode.elm.nodeValue = newVnode.text;
//       }
//     } else if (newVnode.tag) {
//       patchProps(newVnode, oldVnode);
//       console.log(newFiber);
//       if (newFiber.sibling && oldFiber.sibling) {
//         patchFiber(oldFiber.sibling, newFiber.sibling);
//       }
//     }
//   }
//
//   function patchProps (newVnode, oldVnode) {
//     const attrs = newVnode.data.attrs;
//     const on = newVnode.data.on;
//     const oldAttrs = oldVnode.data.attrs;
//     const elm = newVnode.elm;
//     patchAttrs(elm, oldAttrs, attrs);
//     patchEvents(elm, on);
//   }
//
//   function patchAttrs (el, oldAttrs, newAttrs) {
//     if (oldAttrs) {
//       Object.keys(oldAttrs).forEach((attr) => {
//         if (newAttrs[attr] !== oldAttrs[attr]) {
//           el.removeAttribute(attr);
//         }
//       });
//     }
//
//     Object.keys(newAttrs).forEach((attr) => {
//       if (attr === 'value') {
//         el.value = newAttrs[attr];
//       }
//       if (!oldAttrs || newAttrs[attr] !== oldAttrs[attr]) {
//         el.setAttribute(attr, newAttrs[attr]);
//       }
//     });
//   }
// }
//
// function isSameFiber (o, n) {
//   return o.ref.tag === n.ref.tag && o.ref.key === n.ref.key;
// }
//
// function fiber2Node () {
//
// }
//
// export function emptyNodeAt (elm) {
//   return new VNode(elm.tagName.toLowerCase(), {}, [], elm);
// }
//
// function emptyFiberAt (elm) {
//   return {
//     child: null,
//     sibling: null,
//     index: 0,
//     ref: emptyNodeAt(elm),
//     return: null
//   };
// }
//
// class VNode {
//   private readonly tag: any;
//   private readonly data: any;
//   private readonly elm: undefined;
//   private readonly context: undefined;
//   private readonly text: undefined;
//   private readonly key: undefined;
//   private readonly _sugar: undefined;
//
//   constructor (tag?, data?, children?, elm?) {
//     this.tag = tag;
//     this.data = data;
//     // @ts-expect-error
//     this.children = children;
//     this.key = data.attrs?.key;
//     this.elm = elm;
//     this.context = undefined;
//     this.text = undefined;
//   }
// }
//
// function patchEvents (el, newOn) {
//   const _vei = el._vei || (el._vei = {});
//   Object.keys(_vei).forEach((eventName) => {
//     el.removeEventListener(eventName, _vei[eventName]);
//   });
//   Object.keys(newOn).forEach((eventName) => {
//     _vei[eventName] = newOn[eventName].fun;
//     el.addEventListener(eventName, newOn[eventName].fun);
//   });
// }
