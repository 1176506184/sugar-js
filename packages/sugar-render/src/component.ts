import { deepClone, guid, isArray } from '@sugar/sugar-shared';
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

  const _sugar: any = deepClone(parentComponent);
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
  const { mounted, update } = componentRender();
  const $: any = {};
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
    use,
    parent: instance.parent,
  };

  if (isArray(vm.components)) {
    vm.components = vm.components.reduce((acc, cur) => {
      acc[cur.name] = cur;
      return acc;
    }, {});
  }

  Object.values(data).forEach((d: any) => {
    if (d.headTag && d.render && d.name && d.bulk) {
      use(d);
    }
  });

  function mount() {
    mounted(vm, data);
    mountHandleList[appId]?.forEach((item: any) => {
      item.fun();
      item.used = true;
    });

    effect(() => {
      update(vm);
    });
  }

  function forceUpdate() {
    update(vm);
  }

  function updateSlot(slot: any) {
    vm.slot = slot;
    update(vm);
  }

  function use(components: any) {
    if (!isArray(components)) {
      components = [components];
    }
    components.forEach((component: any) => {
      if (component.name) {
        vm.components[component.name] = component;
        vm.components[component.name].components = vm.components;
      } else if (component.fun) {
        $[component.fun] = component.bulk;
      }
    });
  }

  return {
    vm,
    mount,
    ...data,
    updateSlot,
    forceUpdate,
    use,
    $,
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
  }

  function update(vm: any) {
    const vmFiber: any = VmDataRefPassive(vm);
    const vnode = render.call(VmDataRefPassive(vm));
    vm.slot.length && assembling(vnode, vm.slot);
    patch(vmFiber, vnode);
    vmFiber._vnode = vnode;
  }

  function assembling(_n: any, slot: any) {
    for (let i = 0; i < _n.children.length; i++) {
      const child = _n.children[i];
      if (child.tag === 'slot' && isDefault(slot) && child.data.attrs?.name === 'default') {
        _n.children.splice(0, 1, ...slot);
      } else if (child.tag === 'slot' && child.data.attrs?.name) {
        const NamedSlot = slot.find((s: any) => {
          return s.data?.attrs.slot === child.data.attrs.name;
        });
        updateSlot(child, NamedSlot, _n.children);
      } else if (child.children?.length) {
        assembling(child, slot);
      }
    }
  }

  function isDefault(slot: any) {
    return !slot.find((s: any) => {
      return !!s.data?.attrs.slot;
    });
  }

  function updateSlot(oldSlot: any, newSlot: any, parent: any[]) {
    if (!newSlot) {
      parent.splice(parent.indexOf(oldSlot), 1, []);
      return;
    }
    parent.splice(parent.indexOf(oldSlot), 1, ...newSlot.children);
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
