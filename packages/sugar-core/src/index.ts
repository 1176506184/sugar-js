import { type Core } from './types';
import { onMounted, mountHandleList, updateActiveId } from '@sugar/sugar-hook';
import { sugarRender } from '@sugar/sugar-render';
import { guid } from '@sugar/sugar-shared';
import { nextTick } from '@sugar/sugar-reactive';
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
    components: [],
    sugar: {},
    slot: options.slot
  };

  function mount (el) {
    initCSS();
    vm._vnode = vm.$el = typeof el === 'string' ? document.querySelector(`${el}`) : el;
    mounted(vm, data);
    nextTick(() => {
      mountHandleList[appId]?.forEach((item: any) => {
        item.fun();
        item.used = true;
      });
    });
  }

  function install (components) {
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
