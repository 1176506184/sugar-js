import { isArray } from '@sugar/sugar-shared';

const Scheduler = [];
const patchEffect = [];
const callbacks = [];

export function uiEffect (patch) {
  patch();
  patchEffect.push(patch);
}

export function addEffect (dep: any | any[]) {
  if (isArray(dep)) {
    Scheduler.push(...dep);
  } else {
    Scheduler.push(dep);
  }
  flushUiEffect();
}

function flushUiEffect () {
  setTimeout(() => {
    Scheduler.splice(Scheduler.length - 1, 1);
    if (Scheduler.length === 0) {
      patchEffect.forEach((patch) => {
        patch();
      });
      timerFunc();
    }
  });
}

const timerFunc = () => {
  setTimeout(flushCallbacks, 0);
};

function flushCallbacks () {
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function nextTick (cb: Function) {
  callbacks.push(() => {
    if (cb) {
      cb();
    }
  });
  timerFunc();
}
