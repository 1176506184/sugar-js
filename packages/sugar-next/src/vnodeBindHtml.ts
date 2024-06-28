export function vnodeBindHtml (vnode: any, el: any) {
  vnode.elm = el;
  function work (children: any, vnodeChilds: any) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const vnodeChild = vnodeChilds[i];
      vnodeChild.elm = child;
      if (child.children && vnodeChild.children) {
        work(child.children, vnodeChild.children);
      }
    }
  }
  work(el.children, [vnode]);
}
