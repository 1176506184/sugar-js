import { isArray } from '@sugar/sugar-shared';

export function vnode2html (vnode: any) {
  let ssrId = 0;
  const ssrBulk = {

  };
  const html = work(vnode);

  function work (vnode) {
    if (isArray(vnode)) {
      return vnode.map(item => work(item)).join('');
    } else if (!vnode) {
      return '';
    }
    if (vnode.tag) {
      let ssrIdThis = null;
      if (Object.keys(vnode.data.on).length > 0) {
        ssrId = ssrId + 1;
        ssrIdThis = ssrId;
        ssrBulk['ssr-' + ssrId] = vnode.data.on;
      }
      return `<${vnode.tag} ${ssrIdThis ? `data-ssr-id="ssr-${ssrIdThis}"` : ''} ${attrs2str(vnode.data.attrs)}>${work(vnode.children)}</${vnode.tag}>`;
    } else if (vnode.text) {
      return vnode.text;
    }
    return vnode;
  }

  return {
    ssrBulk,
    html
  };
}

function attrs2str (attrs: any) {
  if (attrs) {
    return Object.keys(attrs).map(key => `${key}="${attrs[key]}"`).join(' ');
  }
  return '';
}
