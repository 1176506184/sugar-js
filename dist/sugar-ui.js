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

    const { useEffect, useSignal: useSignal$1
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
            const show = useSignal$1(ctx.model.value);
            const opacity = useSignal$1(0);
            const direction = (_b = (_a = ctx.direction) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 'center';
            const style = useSignal$1('');
            const transform = useSignal$1(getInitDirection(direction));
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

    const { makeSugar, useSignal, onMounted
    // @ts-expect-error
     } = SUGAR;
    const showToast = {
        fun: 'showToast',
        bulk(text, timeout = 2000, style = '') {
            let root = document.createElement('div');
            document.body.appendChild(root);
            let MessageApp = makeSugar({
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
        return _ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-toast","style":_ctx_.style},"on":{}},[_ctx_._SUGAR._v(_ctx_._SUGAR._s(_ctx_.text))]);
      
    },
    headTag: 'div',
                bulk() {
                    return {
                        text,
                        style
                    };
                }
            });
            MessageApp.mount(root);
            setTimeout(() => {
                MessageApp = null;
                root.remove();
                root = null;
            }, timeout);
        }
    };
    const showMessageBox = {
        fun: 'showMessageBox',
        bulk(options = {
            title: '提示',
            content: '这是一条提示的内容',
            confirmText: '确认',
            cancelText: '取消',
            confirm: () => {
            },
            cancel: () => {
            }
        }) {
            let root = document.createElement('div');
            document.body.appendChild(root);
            let MessageApp = makeSugar({
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
        return _ctx_._SUGAR._c('sugar-dialog',{ "attrs":{"model":_ctx_.show},"on":{"close":{"value":"cancel","isStatic":undefined,"modifiers":[]}}},[_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-message-box"},"on":{}},[_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-message-title"},"on":{}},[_ctx_._SUGAR._v(_ctx_._SUGAR._s(_ctx_.title))]),_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-message-box-content"},"on":{}},[_ctx_._SUGAR._v(_ctx_._SUGAR._s(_ctx_.content))]),_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-message-toolbar"},"on":{}},[_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-message-box-btn"},"on":{"click":{"value":"cancel","isStatic":undefined,"modifiers":[]}}},[_ctx_._SUGAR._v(_ctx_._SUGAR._s(_ctx_.cancelText))]),_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-message-box-btn sugar-message-box-confirm"},"on":{"click":{"value":"confirm","isStatic":undefined,"modifiers":[]}}},[_ctx_._SUGAR._v(_ctx_._SUGAR._s(_ctx_.confirmText))])]),_ctx_._SUGAR._c('div',{ "attrs":{},"on":{}},[])])]);
      
    },
    headTag: 'sugar-dialog',
                bulk() {
                    var _a, _b, _c, _d;
                    const show = useSignal(false);
                    function cancel() {
                        options.cancel();
                        show.value = false;
                        setTimeout(() => {
                            MessageApp = null;
                            root.remove();
                            root = null;
                        }, 300);
                    }
                    function confirm() {
                        options.confirm();
                        show.value = false;
                        setTimeout(() => {
                            MessageApp = null;
                            root.remove();
                            root = null;
                        }, 300);
                    }
                    onMounted(() => {
                        show.value = true;
                    });
                    return {
                        title: (_a = options.title) !== null && _a !== void 0 ? _a : '提示',
                        content: (_b = options.content) !== null && _b !== void 0 ? _b : '',
                        show,
                        cancel,
                        confirm,
                        confirmText: (_c = options.confirmText) !== null && _c !== void 0 ? _c : '确定',
                        cancelText: (_d = options.cancelText) !== null && _d !== void 0 ? _d : '取消'
                    };
                }
            });
            MessageApp.install([dialog]);
            MessageApp.mount(root);
        }
    };

    const sugarUI = [button, dialog, showMessageBox, showToast];
    if (typeof window !== 'undefined') {
        (function (global) {
            global.sugarUI = sugarUI;
        })(window);
    }

    exports.sugarUI = sugarUI;

}));
//# sourceMappingURL=sugar-ui.js.map
