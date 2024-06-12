export function useEffect (fun, deps = []) {
  if (typeof fun === 'object') {
    console.log(fun.render());
  } else {
    deps.forEach((dep) => {
      if (typeof dep.initDep === 'function') {
        dep.initDep(fun);
      }
    });
  }
}
