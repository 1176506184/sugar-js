import { createEffect, getCurrentObserver } from './signal/createEffect';
import reactive from './reactive';

const subscribers = new Set();

function ref (fun: any) {
  const result = {};
  if (typeof fun === 'string' || typeof fun === 'number' || typeof fun === 'boolean') {
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

export {
  ref
};