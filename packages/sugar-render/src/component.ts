import { deepClone, guid } from '@sugar/sugar-shared';
import { mountHandleList, updateActiveId, useSignal } from '@sugar/sugar-hook';
import { bindAttrAndEvent, bindT, VmDataRefPassive } from './index';
import { sugarCompiler } from '@sugar/sugar-compiler';
import patch from './patch';
import { addComponentCache, getComponentCache } from './componentCache';

export function bulkComponent (_vnode: any, parentComponent: any) {
  const {
    data: {
      attrs,
      on
    },
    children
  }: any = _vnode;

  const parentInstance = null;

  const _sugar = deepClone(parentComponent);
  const props = {};
  const slot = children;

  Object.keys(attrs).forEach((propName) => {
    if (propName !== 'instance') {
      props[propName] = useSignal(attrs[propName]);
    }
  });
  Object.keys(on).forEach((propName) => {
    if (on[propName].parameters) {
      props[propName] = function () {
        on[propName].fun(...on[propName].parameters);
      };
    } else {
      props[propName] = on[propName].fun;
    }
  });

  if (_vnode.key && getComponentCache(_vnode.key)) {
    return getComponentCache(_vnode.key);
  }
  const app = makeComponent({
    ..._sugar,
    props,
    slot
  });
  app.mount();
  if (parentInstance) {
    parentInstance.value = app;
  }
  _vnode.key && addComponentCache(app, _vnode.key);
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
    components: instance.components ? instance.components : [],
    sugar: {},
    slot: instance.slot,
    props: instance.props,
    headTag: instance.headTag || 'div'
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

  function mounted (vm, data) {
    vm.$el = document.createElement(vm.headTag);
    vm._vnode = vm.$el;
    render = vm.render;
    bindT(vm, data);
    update(vm);

    Object.values(data).forEach((item: any) => {
      if (typeof item === 'object' && item?.sugarRefDataType === 'useState') {
        item.initDep(() => {
          update(vm);
        });
      }
    });

    vm.forceUpdate = function () {
      update(vm);
    };
    update(vm);
    return vm.forceUpdate;
  }

  function update (vm) {
    const vnode = render.call(VmDataRefPassive(vm));
    bindAttrAndEvent(vm, vnode);
    vm.slot.length && assembling(vnode, vm.slot);
    patch(vm, vnode);
    vm._vnode = vnode;
  }

  function assembling (_n, slot) {
    _n.children.forEach((child, index) => {
      if (child.tag === 'slot' && (child.data.attrs?.name === 'default') && isDefault(slot)) {
        _n.children.splice(index, 1, ...slot);
      } else if (child.tag === 'slot' && child.data.attrs?.name) {
        const NamedSlots = slot.filter((s: any) => {
          return s.data?.attrs.slot === child.data.attrs.name;
        });
        _n.children.splice(index, 1, ...NamedSlots);
      } else if (child.tag === 'slot' && !child.data.attrs?.name) {
        const NoNamedSlots = slot.filter((s: any) => {
          return !s.data?.attrs.slot;
        });
        _n.children.splice(index, 1, ...NoNamedSlots);
      } else if (child.children?.length) {
        assembling(child, slot);
      }
    });
  }

  function isDefault (slots) {
    return slots.filter((slot) => {
      return slot.data?.attrs?.slot;
    });
  }

  return {
    update,
    mounted
  };
}
