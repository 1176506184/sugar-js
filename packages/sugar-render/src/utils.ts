export function isComponent(vnode, components) {
  return !!components[vnode.tag];
}
