import { NodeTypes } from '../parse';
import { makeSugar } from '@sugar/sugar-core';
import { deepClone } from '@sugar/sugar-shared';
import { reckon } from '@sugar/sugar-reactive';

export function transformComponents (content, components) {
  const result = components[content.tag];
  if (result) {
    content.tag = '';
    content.type = NodeTypes.COMPONENT;
    const props = {};
    content.sugar = makeSugar({
      ...deepClone(result),
      props,
      slot: content.children
    });
    content.node = document.createElement('div');
    content.node.innerHTML = result.render;
    content.sugar.mount(content.node);
  }
}

function paramKey2Value (params, data) {
  const result = [];
  params.forEach((param) => {
    result.push(data[param]);
  });
  return result;
}

function getDataKey (text) {
  return new Function(`
            with(this) {
              return ${text};
            }
        `);
}
