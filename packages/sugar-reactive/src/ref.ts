import { nextTick } from '@sugar/sugar-reactive';
import { createQueue } from './queue';

export function ref<T> (initValue: T) {
  const callbacks: Function[] = [];
  const queue = createQueue();

  function initDep (dep: Function) {
    callbacks.push(dep);
  }

  // 创建更新触发器
  function triggerUpdate () {
    for (let i = 0; i < callbacks.length; i++) {
      queue.pushQueue(callbacks[i]);
    }
    nextTick(() => {
      queue.flushQueue();
    });
  }

  // 创建响应式代理
  function deepReactive (value: any): any {
    if (typeof value !== 'object' || value === null) return value;

    return new Proxy(value, {
      get (target, prop, receiver) {
        const result = Reflect.get(target, prop, receiver);

        // 自动代理嵌套对象
        if (typeof result === 'object' && result !== null) {
          return deepReactive(result);
        }

        // 如果是数组方法，拦截变更方法
        if (typeof result === 'function' && Array.isArray(target)) {
          const mutatingMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
          if (mutatingMethods.includes(prop as string)) {
            return (...args: any[]) => {
              const res = (result as Function).apply(target, args);
              triggerUpdate();
              return res;
            };
          }
        }

        return result;
      },
      set (target, prop, newVal, receiver) {
        const oldVal = Reflect.get(target, prop, receiver);
        const result = Reflect.set(target, prop, newVal, receiver);
        if (oldVal !== newVal) {
          triggerUpdate();
        }
        return result;
      }
    });
  }

  const data = {
    value: deepReactive(initValue),
    sugarRefDataType: 'useState',
    initDep
  };

  const proxy = new Proxy(data, {
    get (target, prop) {
      return Reflect.get(target, prop);
    },
    set (target, prop, newValue) {
      if (prop === 'value' && target.value !== newValue) {
        target.value = deepReactive(newValue);
        triggerUpdate();
      }
      return true;
    }
  });

  return proxy;
}

export default ref;
