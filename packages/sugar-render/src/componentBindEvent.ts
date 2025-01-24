export function componentBindEvent (vm, vnode) {
  Object.keys(vm.props).forEach((r) => {
    if (['click'].includes(r)) {
      (vnode.data.on = {}) && (vnode.data.on[r] = {
        fun: vm.props[r],
        parameters: vm.props[r].parameters
      });
    }
  });
}
