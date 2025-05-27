import { watch } from './dep';

function useEffect (effect, deps, immediate = false) {
  // 记录上一次依赖的值，用于对比
  let prevDeps = [];

  // 用于获取每个响应式对象的当前值（假设ref对象有.value，reactive直接用）
  function getDepValue (dep) {
    if (dep && typeof dep === 'object' && 'value' in dep) {
      return dep.value; // ref
    }
    return dep; // reactive 或普通对象
  }

  // 判断两个依赖数组是否相等（浅比较）
  function depsChanged (newDeps, oldDeps) {
    if (newDeps.length !== oldDeps.length) return true;
    for (let i = 0; i < newDeps.length; i++) {
      if (newDeps[i] !== oldDeps[i]) return true;
    }
    return false;
  }

  // 执行一次effect并保存依赖
  function runEffect () {
    effect();
    prevDeps = deps.map(getDepValue);
  }

  // 这里模拟响应式依赖监听
  // 假设你有一个全局watcher注册接口 watch(reactive, callback)
  // 监听每个依赖对象变化，检测是否触发effect

  // 先执行一次，如果immediate为true
  if (immediate) {
    runEffect();
  } else {
    // 初始保存依赖
    prevDeps = deps.map(getDepValue);
  }

  // 监听依赖变化
  deps.forEach(dep => {
    watch(dep, () => {
      // 依赖变化时，先取最新依赖值
      const newDeps = deps.map(getDepValue);
      if (depsChanged(newDeps, prevDeps)) {
        effect();
        prevDeps = newDeps;
      }
    });
  });
}

export { useEffect };
