import { NodeTypes } from '../parse';
import { makeSugar } from '@sugar/sugar-core';
import { deepClone } from '@sugar/sugar-shared';

export function transformComponents (content, components, vm) {
  const result = components[content.tag];
  if (result) {
    content.tag = '';
    content.type = NodeTypes.COMPONENT;
    content.sugar = makeSugar(deepClone(result));
    content.node = document.createElement('div');
    content.node.innerHTML = result.render;
    content.sugar.mount(content.node);
    content.sugar.parent = vm;
    vm.sugar[content.sugar.vm.appId] = content.sugar;
  }
}
