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

    const { useEffect: useEffect$2, useSignal: useSignal$1 } = SUGAR;
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
            var _a, _b;
            const show = useSignal$1(ctx.model.value);
            const opacity = useSignal$1(0);
            const direction = (_b = (_a = ctx.direction) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 'center';
            const style = useSignal$1('');
            const transform = useSignal$1(getInitDirection(direction));
            useEffect$2(() => {
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

    const { makeSugar, useSignal, onMounted: onMounted$3 } = SUGAR;
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
                    onMounted$3(() => {
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

    const { useEffect: useEffect$1, useState: useState$4 } = SUGAR;
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
            const [pi, setPi] = useState$4(1);
            const [ps, setPs] = useState$4(20);
            const [total, setTotal] = useState$4(0);
            const [page, setPage] = useState$4([1]);
            const [canNext, setCanNext] = useState$4(false);
            const [canPrev, setCanPrev] = useState$4(false);
            const [showBtn, setShowBtn] = useState$4(false);
            const [showMost, setShowMost] = useState$4(false);
            const [showSis, setShowSis] = useState$4(false);
            function changePage(v) {
                console.log(v);
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
            useEffect$1(() => {
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

    const { onMounted: onMounted$2, useState: useState$3 } = SUGAR;
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
            const [scale, setScale] = useState$3('');
            onMounted$2(() => {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 400) {
                        setScale('transform:scale(1)');
                    }
                    else {
                        setScale('');
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

    function arrow(direction = 'left') {
        return `<svg style="${arrowMap[direction]}" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z" fill="#333"></path></svg>`;
    }
    const arrowMap = {
        let: 'transform: rotate(180deg);',
        right: 'transform: rotate(0deg);',
        top: 'transform: rotate(90deg);',
        bottom: 'transform: rotate(-90deg);'
    };

    const { useEffect, useState: useState$2 } = SUGAR;
    const text = {
        name: 'sugar-text',
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
        return _ctx_._SUGAR._c('div',{ "attrs":{"class":'sugar-text ' + (open ? '':'sugar-text__ellipsis'),"style":_ctx_.style},"on":{}},[_ctx_._SUGAR._c('slot',{ "attrs":{"name":"default"},"on":{}},[]),_ctx_.arrow ? _ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-arrow"},"on":{"click":{"value":_ctx_.click,"isStatic":false,"modifiers":[]}}},[_ctx_._SUGAR._c('div',{attrs:{"class":_ctx_.open ? 'open':''},on:{}},[_ctx_._SUGAR._html(_ctx_.arrowHtml)])]) : _ctx_._SUGAR._e()]);
      
    },
    headTag: 'div',
        bulk(ctx) {
            console.log(ctx);
            const [style, setStyle] = useState$2('');
            const [arrow$1, setArrow] = useState$2(false);
            const [open, setOpen] = useState$2(false);
            useEffect(() => {
                var _a;
                setStyle((_a = ctx.style.value) !== null && _a !== void 0 ? _a : '');
                if (ctx.rows.value > 0) {
                    setStyle((style.value + ';' + getEllipsis(ctx.rows.value)));
                }
                ctx.arrow && setArrow(ctx.arrow.value);
            }, [ctx.style, ctx.rows, ctx.arrow], true);
            function getEllipsis(rows) {
                return `-webkit-line-clamp: ${rows};`;
            }
            function click() {
                setOpen(!open.value);
            }
            return {
                style,
                rows: ctx.rows,
                arrow: arrow$1,
                open,
                click,
                arrowHtml: arrow('bottom')
            };
        }
    };

    const { instance: instance$2 } = SUGAR;
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
        return _ctx_._SUGAR._c('div',{ "attrs":{},"on":{"click":{"value":_ctx_.uploadFile,"isStatic":false,"modifiers":[]}}},[_ctx_._SUGAR._c('slot',{ "attrs":{"name":"default"},"on":{}},[]),_ctx_._SUGAR._c('input',{ "attrs":{"style":"display: none","instance":"fileRef","type":"file"},"on":{"change":{"value":_ctx_.fileInput,"isStatic":false,"modifiers":[]}}},[])]);
      
    },
    headTag: 'div',
        bulk(ctx) {
            const fileRef = instance$2();
            function fileInput(e) {
                const result = [];
                result.push(...e.target.files);
                ctx.change(result);
                fileRef.value.value = '';
            }
            function uploadFile() {
                fileRef.value.click();
            }
            return {
                fileInput,
                fileRef,
                uploadFile
            };
        }
    };

    const { onMounted: onMounted$1, instance: instance$1, useState: useState$1 } = SUGAR;
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
        return _ctx_._SUGAR._c('div',{ "attrs":{"instance":"node"},"on":{}},[_ctx_.show ? _ctx_._SUGAR._c('slot',{ "attrs":{"name":"default"},"on":{}},[]) : _ctx_._SUGAR._e()]);
      
    },
    headTag: 'div',
        bulk(ctx) {
            const [show, setShow] = useState$1(false);
            const node = instance$1();
            onMounted$1(() => {
                window.addEventListener('scroll', () => {
                    if (node.value.getBoundingClientRect().top < window.innerHeight) {
                        setShow(true);
                    }
                });
            });
            return {
                show,
                node
            };
        }
    };

    const { onMounted, instance, useState } = SUGAR;
    const field = {
        name: 'sugar-field',
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
        return _ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-field"},"on":{}},[_ctx_._SUGAR._c('slot',{ "attrs":{"name":"label","instance":"labelRef"},"on":{}},[]),_ctx_.showLabel ? _ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-field-label"},"on":{}},[_ctx_._SUGAR._v(_ctx_._SUGAR._s(_ctx_.label))]) : _ctx_._SUGAR._e(),_ctx_._SUGAR._c('slot',{ "attrs":{"name":"default","instance":"defaultRef"},"on":{}},[]),_ctx_._SUGAR._c('div',{ "attrs":{"class":"sugar-field-input-container"},"on":{}},[_ctx_.showField ? _ctx_._SUGAR._c('input',{ "attrs":{"class":"sugar-field-input","placeholder":_ctx_.placeholder,"value":_ctx_.value},"on":{"input":{"value":_ctx_.onInput,"isStatic":false,"modifiers":[]}}},[]) : _ctx_._SUGAR._e()])]);
      
    },
    headTag: 'div',
        bulk(ctx) {
            var _a, _b, _c;
            const label = ((_a = ctx.label) === null || _a === void 0 ? void 0 : _a.value) || '文本';
            const placeholder = ((_b = ctx.placeholder) === null || _b === void 0 ? void 0 : _b.value) || '请输入';
            const labelRef = instance();
            const defaultRef = instance();
            const [showLabel, setShowLabel] = useState(true);
            const [showField, setShowField] = useState(true);
            const [value, setValue] = useState(((_c = ctx.value) === null || _c === void 0 ? void 0 : _c.value) || '');
            onMounted(() => {
                var _a, _b;
                if (((_a = labelRef.value) === null || _a === void 0 ? void 0 : _a.children.length) > 0) {
                    setShowLabel(false);
                }
                if (((_b = defaultRef.value) === null || _b === void 0 ? void 0 : _b.children.length) > 0) {
                    setShowField(false);
                }
            });
            function onInput(e) {
                setValue(e.target.value);
                ctx.input(e.target.value);
            }
            return {
                label,
                labelRef,
                showLabel,
                defaultRef,
                placeholder,
                showField,
                input: ctx.input,
                value,
                onInput
            };
        }
    };

    const sugarUI = [button, dialog, showMessageBox, showToast, pageNation, BackTop, text, upload, lazy, field];
    if (typeof window !== 'undefined') {
        (function (global) {
            global.sugarUI = sugarUI;
        })(window);
    }

    exports.sugarUI = sugarUI;

}));
//# sourceMappingURL=sugar-ui.js.map
