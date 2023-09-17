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
    props
  });
  app.mount();
  return app;
}

export function makeComponent (instance) {
  const appId = guid();
  updateActiveId(appId);
  const data = instance.bulk(instance.props);
  const { mounted } = componentRender();
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
    mounted(vm, data);
    mountHandleList[appId]?.forEach((item) => {
      item.fun();
      item.used = true;
    });
  }

  return {
    vm,
    mount,
    ...data
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
