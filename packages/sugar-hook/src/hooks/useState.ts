import { nextTick } from '@sugar/sugar-reactive';
export function useState (initValue: any) {
  const queue = createQueue();
  const callbacks = [];

  function initDep (dep) {
    callbacks.push(dep);
  }

  const state = {
    value: initValue,
    sugarRefDataType: 'useState',
    initDep
  };

  const data = {
    value: initValue
  };

  Object.defineProperty(state, 'value', {
    get () {
      return data.value;
    },
    set () {
      console.warn('Prohibit modifying ref variables');
    }
  });

  const setState = (newState: any) => {
    if (data.value !== newState) {
      data.value = newState;
      for (let i = 0; i < callbacks.length; i++) {
        queue.pushQueue(callbacks[i]);
      }
      nextTick(() => {
        queue.flushQueue();
      });
    }
  };

  setState.sugarRefDataType = 'setState';

  return [
    state,
    setState
  ];
}

function createQueue () {
  const queue = [];

  function pushQueue (dep: any) {
    queue.push(dep);
  }

  function flushQueue () {
    if (queue.length > 0) {
      uniqueArray(queue).forEach((dep: any) => dep());
      queue.length = 0;
    }
  }

  function uniqueArray (arr: any) {
    return [...new Set(arr)];
  }

  return {
    queue,
    pushQueue,
    flushQueue
  };
}
