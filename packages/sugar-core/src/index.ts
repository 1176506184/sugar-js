import { type Core } from './types';
import { onMounted, mountHandleList, updateActiveId } from '@sugar/sugar-hook';
import { sugarRender } from '@sugar/sugar-render';
import { guid } from './utils/guid';
import { nextTick } from '@sugar/sugar-reactive';
import { vnodeBindHtml } from '@sugar/sugar-next';
import { initCSS } from './utils/utils';

function makeSugar (options: Core) {
  const appId = guid();
  updateActiveId(appId);
  const data = options.bulk(options.props);
  const { mounted } = sugarRender();
  const vm = {
    render: options.render,
    _vnode: null,
    data,
    $el: null as any,
    appId,
    components: [] as any,
    sugar: {},
    slot: options.slot,
    ssr: options.ssr,
    ssrRender: options.ssrRender
  };

  function mount (el) {
    initCSS();
    vm._vnode = vm.$el = typeof el === 'string' ? document.querySelector(`${el}`) : el;
    if (vm.ssr) {
      vm._vnode = options.ssrVNode;
      vnodeBindHtml(vm._vnode, vm.$el);
    }
    mounted(vm, data);
    nextTick(() => {
      mountHandleList[appId]?.forEach((item: any) => {
        item.fun();
        item.used = true;
      });
    });
  }

  function install (components: any) {
    components.forEach((component) => {
      vm.components[component.name] = component;
      vm.components[component.name].components = vm.components;
    });
  }

  return {
    vm,
    mount,
    ...data,
    install
  };
}

export {
  makeSugar,
  onMounted,
  updateActiveId,
  mountHandleList
};
