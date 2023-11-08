import { isArray } from '@sugar/sugar-shared';

const Scheduler = [];
let patchEffect = null;
const lock = false;
export function uiEffect (patch) {
  patch();
  patchEffect = patch;
}

export function addEffect (dep: any) {
  if (isArray(dep)) {
    Scheduler.push(...dep);
  } else {
    Scheduler.push(dep);
  }
  void nextTick().then(r => {

  });
}

export async function nextTick () {
  setTimeout(() => {
    Scheduler.splice(Scheduler.length - 1, 1);
    if (Scheduler.length === 0) {
      patchEffect();
    }
  });
}
