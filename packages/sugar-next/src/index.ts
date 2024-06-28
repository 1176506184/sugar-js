import { sugarCompiler } from '@sugar/sugar-compiler';
import { bindT, VmDataRefPassive } from '@sugar/sugar-render';
import { guid } from '@sugar/sugar-shared';
import { vnode2html } from './vnode2html';
import { vnodeBindHtml } from './vnodeBindHtml';

export function createSSRApp (options = {
  sugarJsSrc: '',
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
    html,
    ssrBulk
  } = vnode2html(VNode);

  const ssrBulkFunction = function (global: any) {
    Object.keys(global.ssrBulk).forEach((item) => {
      Object.keys(global.ssrBulk[item]).forEach((s) => {
        document.querySelector(`[data-ssr-id="${item}"]`).addEventListener(s, () => {
          global.window.root[global.ssrBulk[item][s].value]();
        });
      });
    });
  };

  return createHtml(html, options.bulk.toString(), ssrBulkFunction.toString(), JSON.stringify(ssrBulk), code.toString(), JSON.stringify(VNode));
}

function createHtml (html: string, bulk: string, event: string, initBulk: string, render: string, initVNode: string) {
  return `<html lang="">
            <head>
                <title></title>
                <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
            </head>
            <script src="/dist/sugar.js"></script>
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
            
            const global = {
              window,
              ssrBulk:${initBulk}
            };
            
            var root = makeSugar({
                bulk:${bulk},
                ssr:true,
                ssrRender:${render},
                ssrVNode:${initVNode}
            });
            
            root.mount('#ssr-root');
            
            
            (${event})(global);
          </script>`;
}

export { vnodeBindHtml };
