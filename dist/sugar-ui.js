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
        return _ctx_._SUGAR._c('button',{ "attrs":{"class":"sugar-button","style":"margin: 5px 5px 0;"},"on":{"click":{"value":_ctx_.click,"isStatic":false,"modifiers":[]}}},[_ctx_._SUGAR._c('slot',{ "attrs":{"name":"default"},"on":{}},[]),_ctx_._SUGAR._c('slot',{ "attrs":{"name":"label"},"on":{}},[])]);
      
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

    const { ref: ref$5, watch: watch$1 } = SUGAR;
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
        return _ctx_._SUGAR._c('div',{ "attrs":{},"on":{}},[_ctx_.show ? _ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-dialog-mode","style":_ctx_.style},"on":{"click":{"value":_ctx_.close,"isStatic":false,"modifiers":["self"]}}},[_ctx_.show ? _ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-dialog","style":'transform:' + _ctx_.transform},"on":{"click":{"value":_ctx_.close,"isStatic":false,"modifiers":["self"]}}},[_ctx_._SUGAR._c('slot',{ "attrs":{"name":"default"},"on":{}},[])]) : _ctx_._SUGAR._e()]) : _ctx_._SUGAR._e()]);
      
    },
    headTag: 'div',
        bulk(ctx) {
            var _a;
            const show = ref$5(ctx.model);
            const opacity = ref$5(0);
            const direction = (_a = ctx.direction) !== null && _a !== void 0 ? _a : 'center';
            const style = ref$5('');
            const transform = ref$5(getInitDirection(direction));
            watch$1(ctx.model, (newValue) => {
                if (ctx.model) {
                    show.value = true;
                    setTimeout(() => {
                        opacity.value = 1;
                        style.value = `opacity:${opacity.value};`;
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
            });
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

    const { onMounted: onMounted$2, ref: ref$4 } = SUGAR;
    const BackTop = {
        name: 'sugar-back-top',
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
        return _ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-back-top","style":_ctx_.scale},"on":{"click":{"value":_ctx_.goTop,"isStatic":false,"modifiers":[]}}},[_ctx_._SUGAR._c('svg',{ "attrs":{"class":"icon","viewBox":"0 0 1024 1024","xmlns":"http://www.w3.org/2000/svg","width":"100","height":"100"},"on":{}},[_ctx_._SUGAR._c('path',{ "attrs":{"d":"M832 165.76H192c-26.24 0-48 21.76-48 48s21.76 48 48 48h640c26.24 0 48-21.76 48-48s-21.76-48-48-48zM551.04 376.96A58.688 58.688 0 0 0 512 360.32c-12.8 0-29.44 7.04-38.4 16L254.08 595.84c-18.56 18.56-18.56 49.28 0 67.84s49.28 18.56 67.84 0l142.08-142.08v348.16c0 26.24 21.76 48 48 48s48-21.76 48-48V521.6l142.08 142.08c9.6 9.6 21.76 14.08 33.92 14.08s24.32-4.48 33.92-14.08c18.56-18.56 18.56-49.28 0-67.84L551.04 376.96z","p-id":"2865","fill":"#ffffff"},"on":{}},[])])]);
      
    },
    headTag: 'div',
        bulk() {
            const scale = ref$4('');
            onMounted$2(() => {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 400) {
                        scale.value = 'transform:scale(1)';
                    }
                    else {
                        scale.value = '';
                    }
                });
            });
            function goTop() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            return {
                goTop,
                scale
            };
        }
    };

    const { watch, ref: ref$3 } = SUGAR;
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
        return _ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-pagination","style":_ctx_.style},"on":{}},[_ctx_._SUGAR._c('ul',{ "attrs":{"class":"sugar-pagination__items"},"on":{}},[_ctx_.showBtn ? _ctx_._SUGAR._c('li',{ "attrs":{"class":"sugar-pagination__item"},"on":{"click":{"value":_ctx_.prev,"isStatic":false,"modifiers":[]}}},[_ctx_._SUGAR._c('svg',{ "attrs":{"t":"1741916731985","class":"icon","viewBox":"0 0 1024 1024","version":"1.1","xmlns":"http://www.w3.org/2000/svg","p-id":"2581","width":"100","height":"100"},"on":{}},[_ctx_._SUGAR._c('path',{ "attrs":{"d":"M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z","fill":_ctx_.canPrev?'#333':'#8a8a8a'},"on":{}},[])])]) : _ctx_._SUGAR._e(),..._ctx_._SUGAR._loop((item,index)=>{
            return _ctx_._SUGAR._c('li',{ "attrs":{"class":_ctx_.pi === item ? 'sugar-pagination__item sugar-pagination__item--active':'sugar-pagination__item'},"on":{"click":{"value":(e)=>{_ctx_.changePage(item);},"isStatic":true,"modifiers":[]}}},[_ctx_._SUGAR._c('button',{ "attrs":{},"on":{}},[_ctx_._SUGAR._v(_ctx_._SUGAR._s(item))])])
                                },_ctx_.page),_ctx_.showBtn ? _ctx_._SUGAR._c('li',{ "attrs":{"class":"sugar-pagination__item right_arrow"},"on":{"click":{"value":_ctx_.next,"isStatic":false,"modifiers":[]}}},[_ctx_._SUGAR._c('svg',{ "attrs":{"t":"1741916731985","class":"icon","viewBox":"0 0 1024 1024","version":"1.1","xmlns":"http://www.w3.org/2000/svg","p-id":"2581","width":"100","height":"100"},"on":{}},[_ctx_._SUGAR._c('path',{ "attrs":{"d":"M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z","fill":_ctx_.canNext?'#333':'#8a8a8a'},"on":{}},[])])]) : _ctx_._SUGAR._e()])]);
      
    },
    headTag: 'div',
        bulk(ctx) {
            const pi = ref$3(1);
            const ps = ref$3(20);
            const total = ref$3(0);
            const page = ref$3([1]);
            const canNext = ref$3(false);
            const canPrev = ref$3(false);
            const showBtn = ref$3(false);
            const showMost = ref$3(false);
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
            watch(ctx, () => {
                update();
            });
            function update() {
                ps.value = ctx.ps;
                pi.value = ctx.pi;
                total.value = ctx.total;
                page.value = generateNumberParts(pi.value, ctx.page, Math.ceil(total.value / ps.value));
                canPrev.value = pi.value > 1;
                canNext.value = pi.value < Math.ceil(total.value / ps.value);
                ctx.btn && (showBtn.value = ctx.btn);
                ctx['show-most'] && (showMost.value = ctx['show-most']);
                if (showMost.value && !page.value.includes(1)) {
                    page.value = [1, ...page.value];
                }
                if (showMost.value && !page.value.includes(Math.ceil(total.value / ps.value))) {
                    page.value = [...page.value, Math.ceil(total.value / ps.value)];
                }
            }
            return {
                pi,
                ps,
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

    const { makeSugar, ref: ref$2, onMounted: onMounted$1 } = SUGAR;
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
        return _ctx_._SUGAR._c('sugar-dialog',{ "attrs":{"model":_ctx_.show},"on":{"close":{"value":_ctx_.cancel,"isStatic":false,"modifiers":[]}}},[_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-message-box"},"on":{}},[_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-message-title"},"on":{}},[_ctx_._SUGAR._v(_ctx_._SUGAR._s(_ctx_.title))]),_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-message-box-content"},"on":{}},[_ctx_._SUGAR._v(_ctx_._SUGAR._s(_ctx_.content))]),_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-message-toolbar"},"on":{}},[_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-message-box-btn"},"on":{"click":{"value":_ctx_.cancel,"isStatic":false,"modifiers":[]}}},[_ctx_._SUGAR._v(_ctx_._SUGAR._s(_ctx_.cancelText))]),_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-message-box-btn sugar-message-box-confirm"},"on":{"click":{"value":_ctx_.confirm,"isStatic":false,"modifiers":[]}}},[_ctx_._SUGAR._v(_ctx_._SUGAR._s(_ctx_.confirmText))])]),_ctx_._SUGAR._c('div',{ "attrs":{},"on":{}},[])])]);
      
    },
    headTag: 'sugar-dialog',
                bulk() {
                    var _a, _b, _c, _d;
                    const show = ref$2(false);
                    function cancel() {
                        options.cancel();
                        show.value = false;
                        setTimeout(() => {
                            MessageApp.vm.$el.remove();
                            MessageApp = null;
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
                    onMounted$1(() => {
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

    const { onMounted, ref: ref$1 } = SUGAR;
    const lazy = {
        name: 'sugar-lazy',
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
        return _ctx_._SUGAR._c('div',{ "attrs":{"ref":"node"},"on":{}},[_ctx_.show ? _ctx_._SUGAR._c('slot',{ "attrs":{"name":"default"},"on":{}},[]) : _ctx_._SUGAR._e()]);
      
    },
    headTag: 'div',
        bulk(ctx) {
            const show = ref$1(false);
            const node = ref$1(null);
            onMounted(() => {
                window.addEventListener('scroll', () => {
                    if (node.value.getBoundingClientRect().top < window.innerHeight) {
                        show.value = true;
                    }
                });
            });
            return {
                show,
                node
            };
        }
    };

    const { ref } = SUGAR;
    const upload = {
        name: 'sugar-upload',
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
        return _ctx_._SUGAR._c('div',{ "attrs":{},"on":{"click":{"value":_ctx_.uploadFile,"isStatic":false,"modifiers":[]}}},[_ctx_._SUGAR._c('slot',{ "attrs":{"name":"default"},"on":{}},[]),_ctx_._SUGAR._c('input',{ "attrs":{"style":"display: none","ref":"fileRef","type":"file"},"on":{"change":{"value":_ctx_.fileInput,"isStatic":false,"modifiers":[]}}},[])]);
      
    },
    headTag: 'div',
        bulk(ctx) {
            const fileRef = ref(null);
            function fileInput(e) {
                const result = [];
                result.push(...e.target.files);
                ctx.change(result);
                fileRef.value.value = '';
            }
            function uploadFile() {
                console.log(fileRef);
                fileRef.value.click();
            }
            return {
                fileInput,
                fileRef,
                uploadFile
            };
        }
    };

    const row = {
        name: 'sugar-row',
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
        return _ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-row"},"on":{}},[_ctx_._SUGAR._c('slot',{ "attrs":{"name":"default"},"on":{}},[])]);
      
    },
    headTag: 'div',
        bulk(ctx) {
            return {};
        }
    };

    const col = {
        name: 'sugar-col',
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
        return _ctx_._SUGAR._c('div',{ "attrs":{"class":'sugar-col sugar-col-' + _ctx_.span},"on":{}},[_ctx_._SUGAR._c('slot',{ "attrs":{"name":"default"},"on":{}},[])]);
      
    },
    headTag: 'div',
        bulk(ctx) {
            return {
                span: ctx.span
            };
        }
    };

    const sugarUI = [button, dialog, BackTop, pageNation, showMessageBox, showToast, upload, lazy, row, col];
    if (typeof window !== 'undefined') {
        (function (global) {
            global.sugarUI = sugarUI;
        })(window);
    }

    exports.sugarUI = sugarUI;

}));
//# sourceMappingURL=sugar-ui.js.map
