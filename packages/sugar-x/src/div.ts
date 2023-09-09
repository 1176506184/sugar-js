import { eventMap, nodeUtils, toUnderLine } from './utils';
import { createEffect } from '@sugar/sugar-reactive';

export function div (attrs?) {
  const node = nodeUtils.cElm('div');

  attrs && Object.keys(attrs).forEach((attr) => {
    if (attr === 'className') {
      if (typeof attrs[attr] === 'string') {
        node.setAttribute('class', attrs[attr]);
      } else {
        createEffect(() => {
          node.setAttribute('class', attrs[attr].value);
        });
      }
    } else if (attr === 'show') {
      const tempDisplay = node.style.display;

      if (attrs[attr] === false) {
        node.style.display = 'none';
      } else if (attrs[attr] === true) {
        node.style.display = tempDisplay;
      } else {
        createEffect(() => {
          console.log(node, attrs[attr].value);

          if (attrs[attr].value === false) {
            node.style.display = 'none';
          } else if (attrs[attr].value === true) {
            node.style.display = tempDisplay;
          }
        });
      }
    } else if (eventMap.includes(attr)) {
      node.addEventListener(attr, attrs[attr]);
    } else {
      if (typeof attrs[attr] === 'string') {
        node.setAttribute(toUnderLine(attr), attrs[attr]);
      } else {
        createEffect(() => {
          node.setAttribute(toUnderLine(attr), attrs[attr].value);
        });
      }
    }
  });

  node.mount = function (el) {
    document.querySelector(el).append(node);
  };

  function dealChildren (...nodes) {
    nodes.forEach((n) => {
      if (typeof n !== 'string' && typeof n !== 'undefined' && !!n.nodeType) {
        node.append(n);
      } else {
        createEffect(() => {
          node.innerText = n;
        });
      }
    });
    return node;
  }

  return dealChildren;
}
