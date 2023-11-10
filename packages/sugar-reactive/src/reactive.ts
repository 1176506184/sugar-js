import { getCurrentObserver } from './signal/createEffect';
import { hasChanged, hasOwn, isIntegerKey } from '@sugar/sugar-shared';
import { addEffect } from './signal/uiEffect';

const targetMap = new WeakMap();
const subscribers = new Set();
const makeReactive = function (value) {
  const createGetter = function (target, propKey, receiver) {
    const val = Reflect.get(target, propKey, receiver);
    if (isObject(val)) {
      return new Proxy(val, {
        get: createGetter,
        set: createSetter
      }); // 代理内层属性
    }
    const currentObserver = getCurrentObserver();
    if (currentObserver) {
      subscribers.add(currentObserver);
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = new Map());
    }
    const dep = depsMap.get(propKey);
    if (!dep && currentObserver) {
      depsMap.set(propKey, currentObserver);
    }
    return Reflect.get(target, propKey, receiver);
  };

  const createSetter = function (target, propKey, value, receiver) {
    const hadKey = isArray(target) ? Number(propKey) < target.length : hasOwn(target, propKey);
    const result = Reflect.set(target, propKey, value, receiver);
    const depsMap = targetMap.get(target);

    if (!depsMap) {
      return;
    }
    let deps: any[] = [];
    deps = Object.values(depsMap);
    const oldValue = target[propKey];
    if (propKey === 'length' && isArray(target)) {
      const newLength = Number(value);
      depsMap.forEach((dep, key) => {
        if (key === 'length' || key >= newLength) {
          deps.push(...subscribers);
        }
      });
    } else {
      if (propKey !== undefined) {
        depsMap.forEach((dep, key) => {
          if (key === 'length' && hasChanged(oldValue, value) && hadKey) {
            deps.push(dep);
          }
        });
      }
    }

    if (!hadKey) {
      if (isIntegerKey(propKey)) {
        deps.push(...subscribers);
      }
    }

    if (!isArray(target)) {
      deps.push(...subscribers);
    }

    deps.forEach((dep) => {
      dep();
      addEffect(dep);
    });

    return result;
  };

  return new Proxy(value, {
    get: createGetter,
    set: createSetter
  });
};

function isArray (value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

const isObject = val => val !== null && typeof val === 'object';

export default makeReactive;
export {};
