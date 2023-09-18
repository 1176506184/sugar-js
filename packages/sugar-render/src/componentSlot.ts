import { guid } from '@sugar/sugar-shared';

export function componentSlot (instance) {
  const { _vnode, parentSugar } = instance;
}

export function makeSlot (instance) {
  const appId = guid();
  const data = instance.parentSugar.vm.data;
  const vm = {

  };
}
