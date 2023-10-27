import { createEffect } from './signal/createEffect';

export function watch (source: any, cb: Function, options = { deep: false }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let getter = null;
  let init = false;
  createEffect(() => {
    if (options.deep) {
      deep(source);
    }
    getter = source;
    if (init) {
      cb();
    }
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
