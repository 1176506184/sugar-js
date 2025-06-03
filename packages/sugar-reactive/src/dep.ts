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
  } else if (isRef(source)) {
    getter = () => source.value;
  } else {
    // 支持 reactive 对象
    getter = () => traverse(source);
  }

  let oldValue;

  // 定义副作用函数，触发getter获取值，执行回调
  function onEffect () {
    const newValue = getter();
    cb(newValue, oldValue);
    oldValue = newValue;
  }

  // 注册副作用函数，响应式数据变化时触发
  effect(onEffect);
}

function isRef (r) {
  return r && typeof r === 'object' && r.__isRef === true;
}

function traverse (value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return;

  seen.add(value);

  if (isRef(value)) {
    // 👇 递归访问 ref 的 .value
    traverse(value.value, seen);
  } else {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }

  return value;
}

export { watch };
