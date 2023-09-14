import { NodeTypes } from '../parse';
import { makeSugar } from '@sugar/sugar-core';
import { deepClone } from '@sugar/sugar-shared';
import { reckon } from '@sugar/sugar-reactive';

export function transformComponents (content, components, vm) {
  const result = components[content.tag];
  if (result) {
    content.tag = '';
    content.type = NodeTypes.COMPONENT;
    const props = {};
    console.log(content.props, props);
    content.props.forEach((prop) => {
      if (prop.name === 'on') {
        props[prop.arg.content] = vm.data[prop.exp.content];
      } else if (prop.name === 'bind') {
        props[prop.arg.content] = reckon(() => {
          return getDataKey(prop.exp.content).call(vm.data);
        });
      }
    });

    content.children.forEach((child) => {
      child.appId = vm.appId;
    });

    content.sugar = makeSugar({
      ...deepClone(result),
      props,
      slot: content.children
    });
    content.node = document.createElement('div');
    content.node.innerHTML = result.render;
    content.sugar.mount(content.node);
    content.sugar.parent = vm;
    content.sugar.vm.sugar[vm.appId] = vm;
    vm.sugar[content.sugar.vm.appId] = content.sugar.vm;
  }
}

function getDataKey (text) {
  return new Function(`
            with(this) {
              return ${text};
            }
        `);
}
