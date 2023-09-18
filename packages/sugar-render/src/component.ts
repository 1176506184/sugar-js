import { deepClone, escape2Html, guid } from '@sugar/sugar-shared';
import { makeSugar, mountHandleList, updateActiveId } from '@sugar/sugar-core';
import { createEffect, reckon, ref } from '@sugar/sugar-reactive';
import { bindAttrAndEvent, bindT, createElement, sugarRender } from './index';
import { sugarCompiler } from '@sugar/sugar-compiler';
import patchEx from './patch';

export function bulkComponent (instance) {
  const { _vnode, parentComponent } = instance;
  const { data, children } = _vnode;
  const _sugar = deepClone(parentComponent);
  const props = {};
  const slot = children;
  Object.keys(data.attrs).forEach((propName) => {
    props[propName] = ref(data.attrs[propName]);
  });
  Object.keys(data.on).forEach((propName) => {
    if (data.on[propName].parameters) {
      props[propName] = function () {
        data.on[propName].fun(...data.on[propName].parameters);
      };
    } else {
      props[propName] = data.on[propName].fun;
    }
  });
  const app = makeComponent({
    ..._sugar,
    props,
    slot
  });
  app.mount();
  return app;
}

export function makeComponent (instance) {
  const appId = guid();
  updateActiveId(appId);
  const data = instance.bulk(instance.props);
  const { mounted } = componentRender();
  let update = null;
  const vm = {
    render: instance.render,
    _vnode: null,
    data,
    $el: null as any,
    appId,
    components: [],
    sugar: {},
    slot: instance.slot,
    props: instance.props
  };

  function mount () {
    update = mounted(vm, data);
    mountHandleList[appId]?.forEach((item) => {
      item.fun();
      item.used = true;
    });
  }

  function updateSlot (slot) {
    vm.slot = slot;
  }

  function forceUpdate () {
    update();
  }

  return {
    vm,
    mount,
    ...data,
    updateSlot,
    forceUpdate
  };
}

export function componentRender () {
  let render = null;
  let components = [];

  function mounted (vm, data) {
    components = vm.components;
    const htmlCode = vm.render;
    const { code, root } = sugarCompiler(htmlCode);
    vm.$el = document.createElement(root.tag);
    vm._vnode = vm.$el;
    render = code;
    bindT(vm, data);
    update(vm);
    vm.forceUpdate = function () {
      update(vm);
    };
    return vm.forceUpdate;
  }

  function update (vm) {
    createEffect(() => {
      const vnode = render.call(vm);
      bindAttrAndEvent(vm, vnode);
      assembling(vnode, vm.slot);
      patchEx(vm, vnode);
      vm._vnode = vnode;
    });
  }

  function assembling (_n, slot) {
    _n.children.forEach((child, index) => {
      if (child.tag === 'slot') {
        _n.children[index] = slot[0];
      } else if (child.children?.length) {
        assembling(child, slot);
      }
    });
  }

  return {
    update,
    mounted
  };
}
