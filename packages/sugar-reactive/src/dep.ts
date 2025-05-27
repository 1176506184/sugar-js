// dep.ts（依赖收集器）
import { queueJob } from './scheduler';

type EffectFn = () => void;

const targetMap = new WeakMap<object, Map<string | symbol, Set<EffectFn>>>();
let activeEffect: EffectFn | null = null;

export function effect (fn: EffectFn) {
  const wrapper = () => {
    activeEffect = wrapper;
    fn();
    activeEffect = null;
  };
  wrapper();
  return wrapper;
}

export function track (target: object, key: string | symbol) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  deps.add(activeEffect);
}

export function trigger (target: object, key: string | symbol) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const effects = depsMap.get(key);
  if (!effects) return;

  for (const effect of effects) {
    queueJob(effect); // 全局调度
  }
}

// watch 实现
function watch (source, cb) {
  // 定义一个内部副作用函数，读取source触发依赖收集
  let getter;
  if (typeof source === 'function') {
    getter = source;
  } else if (source && typeof source === 'object' && 'value' in source) {
    getter = () => source.value;
  } else {
    throw new Error('watch: source must be a function or ref object');
  }

  let oldValue;

  // 定义副作用函数，触发getter获取值，执行回调
  function onEffect () {
    const newValue = getter();
    if (newValue !== oldValue) {
      cb(newValue, oldValue);
      oldValue = newValue;
    }
  }

  // 初始执行一次，建立依赖关系
  effect(() => {
    oldValue = getter();
  });

  // 注册副作用函数，响应式数据变化时触发
  effect(onEffect);
}

export { watch };
