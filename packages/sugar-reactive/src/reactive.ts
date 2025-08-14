// reactive.ts
import { track, trigger } from './dep';

export function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(obj, key, receiver) {
      const res = Reflect.get(obj, key, receiver);
      track(obj, key);
      return typeof res === 'object' && res !== null ? reactive(res) : res;
    },
    set(obj: { [key: string | symbol]: any }, key, value, receiver) {
      const oldVal = obj[key];
      const res = Reflect.set(obj, key, value, receiver);
      if (oldVal !== value) {
        trigger(obj, key);
      }
      return res;
    },
  });
}
