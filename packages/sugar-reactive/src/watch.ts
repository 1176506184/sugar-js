import { createEffect } from './effect/createEffect';
import { deepClone, deepEqual } from '@sugar/sugar-shared';

export function watch (source: any, cb: Function, options = { deep: false }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let getter = null;
  let cache = null;
  let init = false;
  createEffect(() => {
    if (options.deep) {
      deep(source);
    }
    getter = source;
    if (source?.value) {
      getter = source.value;
    }
    if (init && !deepEqual(cache, getter)) {
      cb(source.value);
    }
    cache = deepClone(getter);
    init = true;
  });

  function deep (obj) {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          deep(obj[key]);
        } else {
          getter = obj[key];
        }
      });
    }
    getter = obj;
  }
}
