// ref.ts
import { track, trigger } from './dep';

export function ref<T>(rawValue: T) {
  let value = rawValue;

  return {
    get value() {
      track(this, 'value');
      return value;
    },
    set value(newVal) {
      if (newVal !== value) {
        value = newVal;
        trigger(this, 'value');
      }
    },
    __isRef: true,
  };
}
