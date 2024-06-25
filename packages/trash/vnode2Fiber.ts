export function vnode2Fiber (vnode) {
  const rootFiber = {
    child: null,
    sibling: null,
    index: 0,
    ref: null,
    return: null
  };

  function createFiber (vnode, parentFiber, index = 0, parentVNode) {
    const fiber = {
      child: null,
      sibling: null,
      index,
      ref: null,
      return: parentFiber
    };
    fiber.ref = vnode;
    if (vnode?.children && vnode.children.length > 0) {
      fiber.child = createFiber(vnode.children[0], fiber, 0, vnode);
      fiber.sibling = createFiber(parentVNode.children[index + 1], parentFiber, index + 1, parentVNode);
    }
    return fiber;
  }

  if (vnode.children.length > 0) {
    rootFiber.child = createFiber(vnode.children[0], rootFiber, 0, vnode);
  }

  rootFiber.ref = vnode;

  return rootFiber;
}
