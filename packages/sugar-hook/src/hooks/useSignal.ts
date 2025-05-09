import { nextTick } from '@sugar/sugar-reactive';

export function useSignal<T> (initValue: T) {
  const callbacks: Function[] = [];
  const data = {
    value: initValue,
    sugarRefDataType: 'useState',
    initDep
  };

  const queue = createQueue();

  // 响应式更新逻辑
  const handler = {
    get (target: typeof data, prop: keyof typeof data) {
      return Reflect.get(target, prop);
    },
    set (target: typeof data, prop: keyof typeof data, newValue: T) {
      if (prop === 'value' && target.value !== newValue) {
        target.value = newValue;

        // 触发更新队列
        for (let i = 0; i < callbacks.length; i++) {
          queue.pushQueue(callbacks[i]);
        }

        nextTick(() => {
          queue.flushQueue();
        });
      }
      return true;
    }
  };

  const proxy = new Proxy(data, handler);

  function initDep (dep: Function) {
    callbacks.push(dep);
  }

  return proxy;
}

// 保留原来的 createQueue
function createQueue () {
  const queue: Function[] = [];

  function pushQueue (dep: Function) {
    queue.push(dep);
  }

  function flushQueue () {
    if (queue.length > 0) {
      uniqueArray(queue).forEach((dep) => dep());
      queue.length = 0;
    }
  }

  function uniqueArray (arr: Function[]) {
    return [...new Set(arr)];
  }

  return {
    queue,
    pushQueue,
    flushQueue
  };
}

export default useSignal;
