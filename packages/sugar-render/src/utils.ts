export function isComponent(vnode: any, components: any) {
  return !!components[vnode.tag];
}
