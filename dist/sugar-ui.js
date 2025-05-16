(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Sugar = {}));
})(this, (function (exports) { 'use strict';

    // @ts-expect-error
    SUGAR;
    const button = {
        name: 'sugar-button',
        render: function anonymous(
    ) {
        const _ctx_ = this;
        new Proxy({}, {
          get(target, prop, receiver) {
            if (prop in ctx) {
              return ctx[prop];
            }
            throw new ReferenceError(`Missing variable ${String(prop)} in template`);
          }
        });
        return _ctx_._SUGAR._c('button',{ "attrs":{"class":"sugar-button","style":"margin: 5px 5px 0;"},"on":{"click":{"value":"click","isStatic":undefined,"modifiers":[]}}},[_ctx_._SUGAR._c('slot',{ "attrs":{"name":"default"},"on":{}},[]),_ctx_._SUGAR._c('slot',{ "attrs":{"name":"label"},"on":{}},[])]);
      
    },
                    headTag: 'button',
        bulk(ctx) {
            function click(e) {
                var _a;
                (_a = ctx.click) === null || _a === void 0 ? void 0 : _a.call(ctx, e);
            }
            return {
                click,
                ctx
            };
        }
    };

    const { useEffect, useSignal
    // @ts-expect-error
     } = SUGAR;
    const dialog = {
        name: 'sugar-dialog',
        render: function anonymous(
    ) {
        const _ctx_ = this;
        new Proxy({}, {
          get(target, prop, receiver) {
            if (prop in ctx) {
              return ctx[prop];
            }
            throw new ReferenceError(`Missing variable ${String(prop)} in template`);
          }
        });
        return _ctx_._SUGAR._c('div',{ "attrs":{},"on":{}},[_ctx_.show ? _ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-dialog-mode","style":_ctx_.style},"on":{"click":{"value":"close","isStatic":undefined,"modifiers":["self"]}}},[_ctx_.show ? _ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-dialog","style":'transform:' + _ctx_.transform},"on":{"click":{"value":"close","isStatic":undefined,"modifiers":["self"]}}},[_ctx_._SUGAR._c('slot',{ "attrs":{"name":"default"},"on":{}},[])]) : _ctx_._SUGAR._e()]) : _ctx_._SUGAR._e()]);
      
    },
                    headTag: 'div',
        bulk(ctx) {
            var _a, _b;
            console.log(ctx);
            const show = useSignal(ctx.model.value);
            const opacity = useSignal(0);
            const direction = (_b = (_a = ctx.direction) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 'center';
            const style = useSignal('');
            const transform = useSignal(getInitDirection(direction));
            useEffect(() => {
                if (ctx.model.value) {
                    show.value = true;
                    setTimeout(() => {
                        opacity.value = 1;
                        style.value = `opacity:${opacity.value};`;
                        console.log(style);
                    }, 50);
                }
                else {
                    opacity.value = 0;
                    style.value = `opacity:${opacity.value};`;
                    setTimeout(() => {
                        if (!ctx.model.value) {
                            show.value = false;
                        }
                    }, 300);
                }
                if (show.value) {
                    setTimeout(() => {
                        transform.value = getInitDirection(direction, show.value);
                    }, 50);
                }
                else {
                    transform.value = getInitDirection(direction, show.value);
                }
            }, [ctx.model], true);
            function close() {
                ctx.close();
            }
            function getInitDirection(type, show = false) {
                if (type === 'center') {
                    return '';
                }
                if (type === 'top') {
                    return show ? 'translateY(0)' : 'translateY(-100%)';
                }
                return '';
            }
            return {
                show,
                close,
                opacity,
                style,
                transform
            };
        }
    };

    const sugarUI = [button, dialog];
    if (typeof window !== 'undefined') {
        (function (global) {
            global.sugarUI = sugarUI;
        })(window);
    }

    exports.sugarUI = sugarUI;

}));
//# sourceMappingURL=sugar-ui.js.map
