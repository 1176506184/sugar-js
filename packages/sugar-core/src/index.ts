import { type Core } from './types';
import { onMounted, mountHandleList, updateActiveId } from '@sugar/sugar-hook';
import { sugarRender } from '@sugar/sugar-render';
import { guid, isArray } from '@sugar/sugar-shared';
import { nextTick } from '@sugar/sugar-reactive';
import { initCSS } from './utils/utils';

function makeSugar (options: Core) {
  const appId = guid();
  updateActiveId(appId);
  const data = options.bulk(options.props);
  const $ = {};
  const { mounted } = sugarRender();
  const vm = {
    render: options.render,
    _vnode: null,
    data,
    $el: null as any,
    appId,
    components: [],
    sugar: {},
    slot: options.slot,
    forceUpdate: () => {}
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
    if (!isArray(components)) {
      components = [components];
    }
    components.forEach((component) => {
      if (component.name) {
        vm.components[component.name] = component;
        vm.components[component.name].components = vm.components;
      } else if (component.fun) {
        $[component.fun] = component.bulk;
      }
    });
    vm.$el && vm.forceUpdate();
  }

  return {
    vm,
    mount,
    ...data,
    install,
    $
  };
}

export {
  makeSugar,
  onMounted,
  updateActiveId,
  mountHandleList
};
