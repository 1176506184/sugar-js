import { deepClone, guid } from '@sugar/sugar-shared';
import { mountHandleList, updateActiveId } from '@sugar/sugar-hook';
import { bindT, VmDataRefPassive } from './index';
import { sugarCompiler } from '@sugar/sugar-compiler';
import patch from './patch';
import { addComponentCache, getComponentCache } from './componentCache';
import { effect, reactive } from '@sugar/sugar-reactive';

export function bulkComponent(_vnode: any, parentComponent: any) {
  const {
    data: { attrs, on },
    children,
  }: any = _vnode;

  const _sugar = deepClone(parentComponent);
  const props: any = reactive({});
  const slot = children;
  Object.keys(attrs).forEach((propName) => {
    if (propName !== 'ref') {
      props[propName] = attrs[propName];
    }
  });
  Object.keys(on).forEach((propName) => {
    if (on[propName].parameters) {
      props[propName] = function () {
        on[propName].value(...on[propName].parameters);
      };
    } else {
      props[propName] = on[propName].value;
    }
  });

  if (_vnode.key && getComponentCache(_vnode.key)) {
    return getComponentCache(_vnode.key);
  }
  const app = makeComponent({
    ..._sugar,
    props,
    slot,
  });
  app.mount();
  _vnode.key && addComponentCache(app, _vnode.key);
  return app;
}

export function makeComponent(instance: any) {
  const appId = guid();
  updateActiveId(appId);
  const data = instance.bulk(instance.props);
  const { mounted } = componentRender();
  let update: any = null;
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
    headTag: instance.headTag || 'div',
  };

  function mount() {
    update = mounted(vm, data);
    mountHandleList[appId]?.forEach((item: any) => {
      item.fun();
      item.used = true;
    });

    effect(() => {
      update();
    });
  }

  function updateSlot(slot: any) {
    vm.slot = slot;
    update();
  }

  function forceUpdate() {
    update();
  }

  return {
    vm,
    mount,
    ...data,
    updateSlot,
    forceUpdate,
  };
}

export function componentRender() {
  let render: any = null;

  function mounted(vm: any, data: any) {
    vm.$el = document.createElement(vm.headTag);
    vm._vnode = vm.$el;
    render = vm.render;
    bindT(vm, data);
    vm.forceUpdate = function () {
      update(vm);
    };
    return vm.forceUpdate;
  }

  function update(vm: any) {
    const vmFiber: any = VmDataRefPassive(vm);
    const vnode = render.call(VmDataRefPassive(vm));
    vm.slot.length && assembling(vnode, vm.slot);
    patch(vmFiber, vnode);
    vmFiber._vnode = vnode;
  }

  function assembling(_n: any, slot: any) {
    _n.children.forEach((child: any, index: any) => {
      if (child.tag === 'slot' && child.data.attrs?.name === 'default' && isDefault(slot)) {
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

  function isDefault(slots: any) {
    return slots.filter((slot: any) => {
      return slot.data?.attrs?.slot;
    });
  }

  return {
    update,
    mounted,
  };
}

export function Component(options: any) {
  const { code, root } = sugarCompiler(options.render);
  return {
    ...options,
    render: code,
    headTag: root.tag,
  };
}
