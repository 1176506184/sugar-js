(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Sugar = {}));
})(this, (function (exports) { 'use strict';

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

    const { useEffect: useEffect$1, useSignal: useSignal$2
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
            const show = useSignal$2(ctx.model.value);
            const opacity = useSignal$2(0);
            const direction = (_b = (_a = ctx.direction) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 'center';
            const style = useSignal$2('');
            const transform = useSignal$2(getInitDirection(direction));
            useEffect$1(() => {
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

    const { makeSugar, useSignal: useSignal$1, onMounted
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
                    const show = useSignal$1(false);
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

    const { useSignal
    // @ts-expect-error
     } = SUGAR;
    function useState(initValue) {
        const data = useSignal(initValue);
        return [data, (value) => {
                data.value = value;
            }];
    }

    const { useEffect
    // @ts-expect-error
     } = SUGAR;
    const pageNation = {
        name: 'sugar-pagination',
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
        return _ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-pagination","style":_ctx_.style},"on":{}},[_ctx_._SUGAR._c('ul',{ "attrs":{"class":"sugar-pagination__items"},"on":{}},[_ctx_.showBtn ? _ctx_._SUGAR._c('li',{ "attrs":{"class":"sugar-pagination__item"},"on":{"click":{"value":"prev","isStatic":undefined,"modifiers":[]}}},[_ctx_._SUGAR._c('svg',{ "attrs":{"t":"1741916731985","class":"icon","viewBox":"0 0 1024 1024","version":"1.1","xmlns":"http://www.w3.org/2000/svg","p-id":"2581","width":"100","height":"100"},"on":{}},[_ctx_._SUGAR._c('path',{ "attrs":{"d":"M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z","fill":_ctx_.canPrev?'#333':'#8a8a8a'},"on":{}},[])])]) : _ctx_._SUGAR._e(),..._ctx_._SUGAR._loop((item,index)=>{
            return _ctx_._SUGAR._c('li',{ "attrs":{"class":_ctx_.pi === item ? 'sugar-pagination__item sugar-pagination__item--active':'sugar-pagination__item'},"on":{"click":{"value":"changePage","isStatic":undefined,"parameters":[item],"modifiers":[]}}},[_ctx_._SUGAR._c('button',{ "attrs":{},"on":{}},[_ctx_._SUGAR._v(_ctx_._SUGAR._s(item))])])
                                },_ctx_.page),_ctx_.showBtn ? _ctx_._SUGAR._c('li',{ "attrs":{"class":"sugar-pagination__item right_arrow"},"on":{"click":{"value":"next","isStatic":undefined,"modifiers":[]}}},[_ctx_._SUGAR._c('svg',{ "attrs":{"t":"1741916731985","class":"icon","viewBox":"0 0 1024 1024","version":"1.1","xmlns":"http://www.w3.org/2000/svg","p-id":"2581","width":"100","height":"100"},"on":{}},[_ctx_._SUGAR._c('path',{ "attrs":{"d":"M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z","fill":_ctx_.canNext?'#333':'#8a8a8a'},"on":{}},[])])]) : _ctx_._SUGAR._e()])]);
      
    },
    headTag: 'div',
        bulk(ctx) {
            console.log(ctx);
            const [pi, setPi] = useState(1);
            const [ps, setPs] = useState(20);
            const [total, setTotal] = useState(0);
            const [page, setPage] = useState([1]);
            const [canNext, setCanNext] = useState(false);
            const [canPrev, setCanPrev] = useState(false);
            const [showBtn, setShowBtn] = useState(false);
            const [showMost, setShowMost] = useState(false);
            const [showSis, setShowSis] = useState(false);
            function changePage(v) {
                ctx.change(v);
            }
            function prev() {
                if (pi.value > 1) {
                    ctx.change(pi.value - 1);
                }
            }
            function next() {
                if (pi.value < Math.ceil(total.value / ps.value)) {
                    ctx.change(pi.value + 1);
                }
            }
            function generateNumberParts(f, n, c) {
                f = Number(f);
                n = Number(n);
                c = Number(c);
                const front = [];
                for (let i = 1; i <= n; i++) {
                    const tmp = f - i;
                    if (tmp > 0) {
                        front.unshift(tmp);
                    }
                }
                const end = [];
                for (let i = 1; i <= (n + (n - front.length)); i++) {
                    const tmp = f + i;
                    if (tmp <= c) {
                        end.push(tmp);
                    }
                }
                if (end.length < n) {
                    const length = front.length;
                    for (let i = 1; i <= (n - end.length); i++) {
                        const tmp = f - length - i;
                        if (tmp > 0) {
                            front.unshift(tmp);
                        }
                    }
                }
                return [...front, f, ...end];
            }
            update();
            useEffect(() => {
                update();
            }, [ctx.ps, ctx.pi, ctx.total, ctx.btn, ctx.page, ctx['show-most'], ctx['show-sis']], true);
            function update() {
                setPs(ctx.ps.value);
                setPi(ctx.pi.value);
                setTotal(ctx.total.value);
                setPage(generateNumberParts(pi.value, ctx.page.value, Math.ceil(total.value / ps.value)));
                ctx['show-sis'] && setShowSis(ctx['show-sis'].value);
                if (pi.value > 1) {
                    setCanPrev(true);
                }
                else {
                    setCanPrev(false);
                }
                if (pi.value < Math.ceil(total.value / ps.value)) {
                    setCanNext(true);
                }
                else {
                    setCanNext(false);
                }
                ctx.btn && setShowBtn(ctx.btn.value);
                ctx['show-most'] && setShowMost(ctx['show-most'].value);
                if (showMost.value && !page.value.includes(1)) {
                    setPage([1, ...page.value]);
                }
                if (showMost.value && !page.value.includes(Math.ceil(total.value / ps.value))) {
                    setPage([...page.value, Math.ceil(total.value / ps.value)]);
                }
            }
            return {
                pi,
                setPi,
                ps,
                setPs,
                total,
                page,
                style: ctx.style,
                canNext,
                canPrev,
                changePage,
                showBtn,
                prev,
                next
            };
        }
    };

    const sugarUI = [button, dialog, showMessageBox, showToast, pageNation];
    if (typeof window !== 'undefined') {
        (function (global) {
            global.sugarUI = sugarUI;
        })(window);
    }

    exports.sugarUI = sugarUI;

}));
//# sourceMappingURL=sugar-ui.js.map
