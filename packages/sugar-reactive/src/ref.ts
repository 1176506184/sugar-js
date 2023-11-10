import { createEffect, getCurrentObserver } from './signal/createEffect';
import reactive from './reactive';
import { addEffect } from './signal/uiEffect';

const subscribers = new Set();

function ref (fun: any) {
  const result = {};
  if (typeof fun === 'string' || typeof fun === 'number' || typeof fun === 'boolean' || fun === null) {
    const data = {
      value: fun
    };
    return Object.defineProperty(result, 'value', {
      get () {
        const currentObserver = getCurrentObserver();
        if (currentObserver) {
          subscribers.add(currentObserver);
        }
        return data.value;
      },
      set (newValue) {
        if (newValue !== data.value) {
          data.value = newValue;
          const subscribersToRun = new Set();
          const currentObserver = getCurrentObserver();
          subscribers.forEach((subscriber: Function) => {
            if (subscribers !== currentObserver) {
              subscribersToRun.add(subscriber);
            }
          });
          subscribersToRun.forEach((subscriber: Function) => subscriber());
          addEffect(subscribersToRun);
        }
      }
    });
  } else {
    const data = reactive({
      value: fun
    });

    return Object.defineProperty(result, 'value', {
      get () {
        const currentObserver = getCurrentObserver();
        if (currentObserver) {
          subscribers.add(currentObserver);
        }
        return data.value;
      },
      set (newValue) {
        if (newValue !== data.value) {
          data.value = newValue;
        }
      }
    });
  }
}

function instance () {
  const result = {};
  const data = {
    value: null
  };
  return Object.defineProperty(result, 'value', {
    get () {
      return data.value;
    },
    set (newValue) {
      if (newValue !== data.value) {
        data.value = newValue;
      }
    }
  });
}

export {
  ref,
  instance
};
