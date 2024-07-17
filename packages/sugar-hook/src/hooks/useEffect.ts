export function useEffect (fun, deps = [], run = false) {
  if (typeof fun === 'object') {
    console.log(fun.render());
  } else {
    deps.forEach((dep) => {
      if (typeof dep.initDep === 'function') {
        dep.initDep(fun);
      }
    });
  }
  if (run) {
    fun();
  }
}
