import { sugarCompiler } from '@sugar/sugar-compiler';
import { bindT, VmDataRefPassive } from '@sugar/sugar-render';
import { guid } from '@sugar/sugar-shared';
import { vnode2html } from './vnode2html';
import { vnodeBindHtml } from './vnodeBindHtml';

export function createSSRApp (options = {
  head: '',
  sugarJsSrc: '/dist/sugar.js',
  render: '',
  bulk: () => {
    return {};
  }
}) {
  const appId = guid();
  const data = options.bulk();
  const vm = {
    _vnode: null,
    data,
    $el: null as any,
    appId,
    components: [],
    sugar: {},
    _fiber: null
  };
  bindT(vm, data);
  const { code } = sugarCompiler(options.render);
  const VNode = code.call(VmDataRefPassive(vm));
  const {
    html
  } = vnode2html(VNode);

  return createHtml(html, options.bulk.toString(), code.toString(), JSON.stringify(VNode), options.sugarJsSrc, options.head);
}

function createHtml (html: string, bulk: string, render: string, initVNode: string, sugarJsSrc: string, head: string) {
  return `<html lang="">
            <head>
                ${head}
                <title></title>
                <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
            </head>
            <script src="${sugarJsSrc}"></script>
            <body>
                <div id="ssr-root">
                    ${html}
                </div>
            </body>
          </html>
          <script>
            const {
                makeSugar,
                onMounted,
                ref,
                instance,
                sugarUI,
                useState,
                useEffect,
                nextTick,
                createSSRApp
            } = SUGAR;
            
            var root = makeSugar({
                bulk:${bulk},
                ssr:true,
                ssrRender:${render},
                ssrVNode:${initVNode}
            });
            
            root.mount('#ssr-root');
                     
          </script>`;
}

export { vnodeBindHtml };
