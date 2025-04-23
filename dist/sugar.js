
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Sugar = {}));
})(this, (function (exports) { 'use strict';

    let mountHandleList = {};
    let ActiveId = '';
    function onMounted(handle) {
        if (!mountHandleList[ActiveId]) {
            mountHandleList[ActiveId] = [];
        }
        mountHandleList[ActiveId].push({
            used: false,
            fun: handle
        });
    }
    function updateActiveId(id) {
        ActiveId = id;
    }

    function useState(initValue) {
        const queue = createQueue();
        const callbacks = [];
        function initDep(dep) {
            callbacks.push(dep);
        }
        const state = {
            value: initValue,
            sugarRefDataType: 'useState',
            initDep
        };
        const data = {
            value: initValue
        };
        Object.defineProperty(state, 'value', {
            get() {
                return data.value;
            },
            set() {
                console.warn('Prohibit modifying ref variables');
            }
        });
        const setState = (newState) => {
            if (data.value !== newState) {
                data.value = newState;
                for (let i = 0; i < callbacks.length; i++) {
                    queue.pushQueue(callbacks[i]);
                }
                setTimeout(() => {
                    queue.flushQueue();
                });
            }
        };
        setState.sugarRefDataType = 'setState';
        return [
            state,
            setState
        ];
    }
    function createQueue() {
        const queue = [];
        function pushQueue(dep) {
            queue.push(dep);
        }
        function flushQueue() {
            if (queue.length > 0) {
                uniqueArray(queue).forEach((dep) => dep());
                queue.length = 0;
            }
        }
        function uniqueArray(arr) {
            return [...new Set(arr)];
        }
        return {
            queue,
            pushQueue,
            flushQueue
        };
    }

    function useEffect(fun, deps = [], run = false) {
        if (typeof fun === 'object') {
            console.log(fun.render());
        }
        else {
            deps.forEach((dep) => {
                if (dep && typeof dep.initDep === 'function') {
                    dep.initDep(fun);
                }
            });
        }
        if (run) {
            fun();
        }
    }

    const isArray$1 = Array.isArray;
    const extend = Object.assign;

    function parse(context, ancestors) {
        const parent = last(ancestors);
        const nodes = [];
        while (!isEnd(context, ancestors)) {
            const s = context.source;
            let node;
            if (startsWith(s, context.options.delimiters[0])) {
                node = parseInterpolation(context);
            }
            else if (s[0] === '<') {
                if (s.length === 1) ;
                else if (s[1] === '/') {
                    if (s[2] === '>') {
                        advanceBy(context, 3);
                        continue;
                    }
                    else if (/[a-z]/i.test(s[2])) {
                        parseTag(context, 1 /* TagType.End */);
                        continue;
                    }
                    else {
                        node = parseComment(context);
                    }
                }
                else if (/[a-z]/i.test(s[1])) {
                    node = parseElement(context, ancestors);
                }
                else if (s[1] === '!') {
                    node = parseComment(context);
                }
            }
            if (!node) {
                node = parseText(context);
            }
            if (isArray$1(node)) {
                for (let i = 0; i < node.length; i++) {
                    pushNode(nodes, node[i]);
                }
            }
            else {
                pushNode(nodes, node);
            }
        }
        let removedWhitespace = false;
        const shouldCondense = context.options.whitespace !== 'preserve';
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.type === 2 /* NodeTypes.TEXT */) {
                if (!context.inPre) {
                    if (!/[^\t\r\n\f ]/.test(node.content)) {
                        const prev = nodes[i - 1];
                        const next = nodes[i + 1];
                        if (!prev ||
                            !next ||
                            (shouldCondense &&
                                ((prev.type === 3 /* NodeTypes.COMMENT */ &&
                                    next.type === 3 /* NodeTypes.COMMENT */) ||
                                    (prev.type === 3 /* NodeTypes.COMMENT */ &&
                                        next.type === 1 /* NodeTypes.ELEMENT */) ||
                                    (prev.type === 1 /* NodeTypes.ELEMENT */ &&
                                        next.type === 3 /* NodeTypes.COMMENT */) ||
                                    (prev.type === 1 /* NodeTypes.ELEMENT */ &&
                                        next.type === 1 /* NodeTypes.ELEMENT */ &&
                                        /[\r\n]/.test(node.content))))) {
                            removedWhitespace = true;
                            nodes[i] = null;
                        }
                        else {
                            // Otherwise, the whitespace is condensed into a single space
                            node.content = ' ';
                        }
                    }
                    else if (shouldCondense) {
                        // in condense mode, consecutive whitespaces in text are condensed
                        // down to a single space.
                        node.content = node.content.replace(/[\t\r\n\f ]+/g, ' ');
                    }
                }
                else {
                    // #6410 normalize windows newlines in <pre>:
                    // in the DOM
                    node.content = node.content.replace(/\r\n/g, '\n');
                }
            }
            else if (node.type === 3 /* NodeTypes.COMMENT */ && !context.options.comments) {
                removedWhitespace = true;
                nodes[i] = null;
            }
        }
        if (context.inPre && parent && context.options.isPreTag(parent.tag)) {
            // remove leading newline per html spec
            // https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element
            const first = nodes[0];
            if (first && first.type === 2 /* NodeTypes.TEXT */) {
                first.content = first.content.replace(/^\r?\n/, '');
            }
        }
        return removedWhitespace ? nodes.filter(Boolean) : nodes;
    }
    function parseAttributes(context, type) {
        const props = [];
        const attributeNames = new Set();
        while (context.source.length > 0 &&
            !startsWith(context.source, '>') &&
            !startsWith(context.source, '/>')) {
            if (startsWith(context.source, '/')) {
                advanceBy(context, 1);
                advanceSpaces(context);
                continue;
            }
            const attr = parseAttribute(context, attributeNames);
            if (attr.type === 6 /* NodeTypes.ATTRIBUTE */ &&
                attr.value &&
                attr.name === 'class') {
                attr.value.content = attr.value.content.replace(/\s+/g, ' ').trim();
            }
            if (type === 0 /* TagType.Start */) {
                props.push(attr);
            }
            advanceSpaces(context);
        }
        return props;
    }
    function parseAttribute(context, nameSet) {
        var _a;
        const start = getPos(context);
        const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source);
        const name = match[0];
        nameSet.add(name);
        advanceBy(context, name.length);
        let value;
        if (/^[\t\r\n\f ]*=/.test(context.source)) {
            advanceSpaces(context);
            advanceBy(context, 1);
            advanceSpaces(context);
            value = parseAttributeValue(context);
        }
        const loc = getSelection(context, start);
        if (!context.inVPre && /^(v-[A-Za-z0-9-]|:|\.|@|#)/.test(name)) {
            const match = /(?:^v-([a-z0-9-]+))?(?:(?::|^\.|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(name);
            const isPropShorthand = startsWith(name, '.');
            const dirName = match[1] ||
                (isPropShorthand || startsWith(name, ':')
                    ? 'bind'
                    : startsWith(name, '@') || startsWith(name, 's-on:')
                        ? 'on'
                        : 'slot');
            let arg;
            if (match[2]) {
                const isSlot = dirName === 'slot';
                const startOffset = name.lastIndexOf(match[2], name.length - (((_a = match[3]) === null || _a === void 0 ? void 0 : _a.length) || 0));
                const loc = getSelection(context, getNewPosition(context, start, startOffset), getNewPosition(context, start, startOffset + match[2].length + ((isSlot && match[3]) || '').length));
                let content = match[2];
                if (content.startsWith('[')) {
                    if (!content.endsWith(']')) {
                        content = content.slice(1);
                    }
                    else {
                        content = content.slice(1, content.length - 1);
                    }
                }
                else if (isSlot) {
                    content += match[3] || '';
                }
                arg = {
                    type: 4 /* NodeTypes.SIMPLE_EXPRESSION */,
                    content,
                    loc
                };
            }
            if (value === null || value === void 0 ? void 0 : value.isQuoted) {
                const valueLoc = value.loc;
                valueLoc.start.offset++;
                valueLoc.start.column++;
                valueLoc.end = advancePosWithClone(valueLoc.start, value.content);
                valueLoc.source = valueLoc.source.slice(1, -1);
            }
            const modifiers = match[3] ? match[3].slice(1).split('.') : [];
            if (isPropShorthand)
                modifiers.push('prop');
            return {
                type: 7 /* NodeTypes.DIRECTIVE */,
                name: dirName,
                exp: value && {
                    type: 4 /* NodeTypes.SIMPLE_EXPRESSION */,
                    content: value.content,
                    loc: value.loc
                },
                arg,
                modifiers,
                loc
            };
        }
        return {
            type: 6 /* NodeTypes.ATTRIBUTE */,
            name,
            value: value && {
                type: 2 /* NodeTypes.TEXT */,
                content: value.content,
                loc: value.loc
            },
            loc
        };
    }
    function getNewPosition(context, start, numberOfCharacters) {
        return advancePosWithClone(start, context.originalSource.slice(start.offset, numberOfCharacters), numberOfCharacters);
    }
    function parseAttributeValue(context) {
        const start = getPos(context);
        let content;
        const quote = context.source[0];
        const isQuoted = quote === '"' || quote === '\'';
        if (isQuoted) {
            // Quoted value.
            advanceBy(context, 1);
            const endIndex = context.source.indexOf(quote);
            if (endIndex === -1) {
                content = parseTextData(context, context.source.length);
            }
            else {
                content = parseTextData(context, endIndex);
                advanceBy(context, 1);
            }
        }
        else {
            // Unquoted
            const match = /^[^\t\r\n\f >]+/.exec(context.source);
            if (!match) {
                return undefined;
            }
            content = parseTextData(context, match[0].length);
        }
        return {
            content,
            isQuoted,
            loc: getSelection(context, start)
        };
    }
    function pushNode(nodes, node) {
        if (node.type === 2 /* NodeTypes.TEXT */) {
            const prev = last(nodes);
            // Merge if both this and the previous node are text and those are
            // consecutive. This happens for cases like "a < b".
            if (prev &&
                prev.type === 2 /* NodeTypes.TEXT */ &&
                prev.loc.end.offset === node.loc.start.offset) {
                prev.content += node.content;
                prev.loc.end = node.loc.end;
                prev.loc.source += node.loc.source;
                return;
            }
        }
        nodes.push(node);
    }
    function parseElement(context, ancestors) {
        last(ancestors);
        const element = parseTag(context, 0 /* TagType.Start */);
        if (element.isSelfClosing || context.options.isVoidTag(element.tag)) {
            return element;
        }
        ancestors.push(element);
        const children = parse(context, ancestors);
        ancestors.pop();
        element.children = children;
        if (startsWithEndTagOpen(context.source, element.tag)) {
            parseTag(context, 1 /* TagType.End */);
        }
        element.loc = getSelection(context, element.loc.start);
        return element;
    }
    function parseTag(context, type, parent) {
        const start = getPos(context);
        const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source);
        const tag = match[1];
        advanceBy(context, match[0].length);
        advanceSpaces(context);
        const props = parseAttributes(context, type);
        let isSelfClosing = false;
        if (context.source.length !== 0) {
            isSelfClosing = startsWith(context.source, '/>');
            advanceBy(context, isSelfClosing ? 2 : 1);
        }
        if (type === 1 /* TagType.End */) {
            return;
        }
        const tagType = 0 /* ElementTypes.ELEMENT */;
        return {
            type: 1 /* NodeTypes.ELEMENT */,
            tag,
            tagType,
            children: [],
            props,
            isSelfClosing,
            loc: getSelection(context, start)
        };
    }
    function parseComment(context) {
        const start = getPos(context);
        const contentStart = context.source[1] === '?' ? 1 : 2;
        let content;
        const closeIndex = context.source.indexOf('-->') + 2;
        if (closeIndex === -1) {
            content = context.source.slice(contentStart);
            advanceBy(context, context.source.length);
        }
        else {
            content = context.source.slice(contentStart, closeIndex);
            advanceBy(context, closeIndex + 1);
        }
        return {
            type: 3 /* NodeTypes.COMMENT */,
            content,
            loc: getSelection(context, start)
        };
    }
    function isEnd(context, ancestors) {
        const s = context.source;
        if (startsWith(s, '</')) {
            for (let i = ancestors.length - 1; i >= 0; --i) {
                if (startsWithEndTagOpen(s, ancestors[i].tag)) {
                    return true;
                }
            }
        }
        return !s;
    }
    function parseInterpolation(context) {
        const [open, close] = context.options.delimiters;
        const closeIndex = context.source.indexOf(close, open.length);
        const start = getPos(context);
        advanceBy(context, open.length);
        const innerStart = getPos(context);
        const innerEnd = getPos(context);
        const rawContentLength = closeIndex - open.length;
        const rawContent = context.source.slice(0, rawContentLength);
        const preTrimContent = matchText(context, rawContentLength);
        const content = preTrimContent.trim();
        const startOffset = preTrimContent.indexOf(content);
        if (startOffset > 0) {
            advancePos(innerStart, rawContent, startOffset);
        }
        const endOffset = rawContentLength - (preTrimContent.length - content.length - startOffset);
        advancePos(innerEnd, rawContent, endOffset);
        advanceBy(context, close.length);
        return {
            type: 5 /* NodeTypes.INTERPOLATION */,
            content: {
                type: 4 /* NodeTypes.SIMPLE_EXPRESSION */,
                content,
                loc: getSelection(context, innerStart, innerEnd)
            },
            loc: getSelection(context, start)
        };
    }
    function parseText(context) {
        const endTokens = ['<', context.options.delimiters[0]];
        let endIndex = context.source.length;
        for (let i = 0; i < endTokens.length; i++) {
            const index = context.source.indexOf(endTokens[i], 1);
            if (index !== -1 && endIndex > index) {
                endIndex = index;
            }
        }
        const start = getPos(context);
        const content = parseTextData(context, endIndex);
        return {
            type: 2 /* NodeTypes.TEXT */,
            content,
            loc: getSelection(context, start)
        };
    }
    function parseTextData(context, length) {
        const rawText = context.source.slice(0, length);
        advanceBy(context, length);
        return rawText;
    }
    function getSelection(context, start, end) {
        end = end || getPos(context);
        return {
            start,
            end,
            source: context.originalSource.slice(start.offset, end.offset)
        };
    }
    function matchText(context, length) {
        const rawText = context.source.slice(0, length);
        advanceBy(context, length);
        return rawText;
    }
    function advanceBy(context, numberOfCharacters) {
        const { source } = context;
        advancePos(context, source, numberOfCharacters);
        context.source = source.slice(numberOfCharacters);
    }
    function advancePos(pos, source, numberOfCharacters = source.length) {
        let linesCount = 0;
        let lastNewLinePos = -1;
        for (let i = 0; i < numberOfCharacters; i++) {
            if (source.charCodeAt(i) === 10 /* newline char code */) {
                linesCount++;
                lastNewLinePos = i;
            }
        }
        pos.offset += numberOfCharacters;
        pos.line += linesCount;
        pos.column =
            lastNewLinePos === -1
                ? pos.column + numberOfCharacters
                : numberOfCharacters - lastNewLinePos;
        return pos;
    }
    function advancePosWithClone(pos, source, numberOfCharacters = source.length) {
        return advancePos(extend({}, pos), source, numberOfCharacters);
    }
    function advanceSpaces(context) {
        const match = /^[\t\r\n\f ]+/.exec(context.source);
        if (match) {
            advanceBy(context, match[0].length);
        }
    }
    function startsWith(source, searchString) {
        return source.startsWith(searchString);
    }
    function startsWithEndTagOpen(source, tag) {
        return (startsWith(source, '</') &&
            source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase() &&
            /[\t\r\n\f />]/.test(source[2 + tag.length] || '>'));
    }
    function last(xs) {
        return xs[xs.length - 1];
    }
    function getPos(context) {
        const { column, line, offset } = context;
        return {
            column,
            line,
            offset
        };
    }

    const NO = (tag) => false;
    function toAst(template) {
        const context = createBaseContent(template);
        return parse(context, [])[0];
    }
    function createBaseContent(content) {
        return {
            column: 1,
            line: 1,
            offset: 0,
            originalSource: content,
            source: content,
            inPre: false,
            inVPre: false,
            options: {
                delimiters: ['{{', '}}'],
                isVoidTag: NO,
                isPreTag: NO,
                isCustomElement: NO,
                getNamespace: (tag, parent) => 0 /* Namespaces.HTML */
            }
        };
    }

    const nodeOps = {
        insert: (child, parent, anchor) => {
            parent.insertBefore(child, anchor || null);
        },
        remove: child => {
            const parent = child.parentNode;
            if (parent) {
                parent.removeChild(child);
            }
        },
        parentNode: node => node.parentNode
    };

    const isArray = (val) => val instanceof Array;
    function isDef(v) {
        return v !== undefined && v !== null;
    }
    function isUndef(v) {
        return v === undefined || v === null;
    }
    function escape2Html(str) {
        const arrEntities = {
            lt: '<',
            gt: '>',
            nbsp: ' ',
            amp: '&',
            quot: '"'
        };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
            return arrEntities[t];
        }).replace(/<[^>]+s-on:([^>]+)>/ig, function (match, p1) {
            return match.replace(/s-on:/g, '@');
        });
    }
    const is = {
        Array: Array.isArray,
        Date: (val) => val instanceof Date,
        Set: (val) => Object.prototype.toString.call(val) === '[object Set]',
        Map: (val) => Object.prototype.toString.call(val) === '[object Map]',
        Object: (val) => Object.prototype.toString.call(val) === '[object Object]',
        Symbol: (val) => Object.prototype.toString.call(val) === '[object Symbol]',
        Function: (val) => Object.prototype.toString.call(val) === '[object Function]'
    };
    function deepClone(value, weakMap = new WeakMap(), strict = false) {
        // 2.1 函数浅拷贝
        /* if (is.Function(value)) return value */
        // 2.2 函数深拷贝
        if (is.Function(value) && strict) {
            if (/^function/.test(value.toString()) || /^\(\)/.test(value.toString())) {
                return new Function('return ' + value.toString())();
            }
            return new Function('return function ' + value.toString())();
        }
        else if (is.Function(value)) {
            return value;
        }
        // 3.Date 深拷贝
        if (is.Date(value))
            return new Date(value.valueOf());
        // 4.判断如果是Symbol的value, 那么创建一个新的Symbol
        if (is.Symbol(value))
            return Symbol(value.description);
        // 5.判断是否是Set类型 进行深拷贝
        if (is.Set(value)) {
            // 5.1 浅拷贝 直接进行解构即可
            // return new Set([...value])
            // 5.2 深拷贝
            const newSet = new Set();
            for (const item of value) {
                // @ts-expect-error
                newSet.add(deepClone(item), weakMap);
            }
            return newSet;
        }
        // 6.判断是否是Map类型
        if (is.Map(value)) {
            // 6.1 浅拷贝 直接进行解构即可
            // return new Map([...value])
            // 6.2 深拷贝
            const newMap = new Map();
            for (const item of value)
                newMap.set(deepClone(item[0], weakMap), deepClone(item[1], weakMap));
            return newMap;
        }
        // 9.判断weakMap是否有值 有值的情况下就直接将值返回就可以
        if (weakMap.has(value))
            return weakMap.get(value);
        // 11.2 判断数组
        if (is.Array(value)) {
            const newArr = [];
            // eslint-disable-next-line @typescript-eslint/no-for-in-array
            for (const item in value)
                newArr[item] = deepClone(value[item], weakMap);
            return newArr;
        }
        // 1.如果不是对象类型则直接将当前值返回
        if (!(is.Object(value)))
            return value;
        // 7.判断传入的对象是数组, 还是对象
        const newObj = is.Array(value) ? [] : {};
        // 10.当weakMap没有值时，将originValue作为key, newObj作为value
        weakMap.set(value, newObj);
        for (const key in value) {
            // 11.1 判断数组
            if (is.Array(value[key]))
                deepClone(value[key], weakMap);
            weakMap.set(value, newObj);
            // 8 进行递归调用
            newObj[key] = deepClone(value[key], weakMap);
        }
        // 4.1 对Symbol作为key进行特殊的处理 拿到对象上面的所有Symbol key，以数组形式返回
        const symbolKeys = Object.getOwnPropertySymbols(value);
        for (const sKey of symbolKeys) {
            // 4.2 这里没有必要创建一个新的Symbol
            // const newSKey = Symbol(sKey.description)
            // 4.3 直接将原来的Symbol key 拷贝到新对象上就可以了
            newObj[sKey] = deepClone(value[sKey], weakMap);
        }
        return newObj;
    }
    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    function addCSS(cssText) {
        const style = document.createElement('style'); // 创建一个style元素
        const head = document.head || document.getElementsByTagName('head')[0]; // 获取head元素
        style.type = 'text/css'; // 这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        // @ts-expect-error
        if (style.styleSheet) { // IE
            const func = function () {
                try {
                    // @ts-expect-error
                    style.styleSheet.cssText = cssText;
                }
                catch (e) {
                }
            };
            // @ts-expect-error
            if (style.styleSheet.disabled) {
                setTimeout(func, 10);
            }
            else {
                func();
            }
        }
        else { // w3c
            // w3c浏览器中只要创建文本节点插入到style元素中就行了
            const textNode = document.createTextNode(cssText);
            style.appendChild(textNode);
        }
        head.appendChild(style); // 把创建的style元素插入到head中
    }

    function transform(context, helpers) {
        function work(context) {
            const props = context.props;
            props === null || props === void 0 ? void 0 : props.forEach((prop) => {
                if (prop.name === 's-if') {
                    helpers.sIf(context, prop);
                }
                if (prop.name === 's-for') {
                    helpers.sFor(context, prop);
                }
                if (prop.name === 's-html') {
                    helpers.sHtml(context, prop);
                }
                if (prop.name === 's-loading') {
                    helpers.sLoading(context, prop);
                }
                if (prop.name === 'on') {
                    helpers.transformEvent(context, prop);
                }
            });
            if (context.tag === 'slot') {
                context.type = 10 /* NodeTypes.SLOT */;
            }
            if (context.children) {
                context.children.forEach((child) => {
                    work(child);
                });
            }
        }
        work(context);
        return context;
    }

    function sIf(context, prop) {
        context.if = {
            value: prop.value.content,
            type: prop.value.type
        };
    }

    function generate(ast) {
        const genElmChildren = (children = []) => {
            let str = '[';
            children.forEach((child, i) => {
                if (child.type === 1 /* NodeTypes.ELEMENT */ || child.type === 5 /* NodeTypes.INTERPOLATION */ || child.type === 10 /* NodeTypes.SLOT */) {
                    str += getElm(child) + `${i === children.length - 1 ? '' : ','}`;
                }
                else if (child.type === 2 /* NodeTypes.TEXT */ && !!child.content.trim()) {
                    str += getElm(child) + `${i === children.length - 1 ? '' : ','}`;
                }
            });
            return str + ']';
        };
        function getElm(ast) {
            let str = '';
            const props = ast.props;
            if (ast.type === 1 || ast.type === 10 /* NodeTypes.SLOT */) {
                let elStr = '';
                let ex = false;
                elStr += `_SUGAR._c('${ast.tag}',{ `;
                elStr += '"attrs":{';
                elStr += dealAttr(props);
                elStr += '},"on":{';
                elStr += dealEvent(props);
                elStr += '}},';
                if (ast.children) {
                    elStr += genElmChildren(ast.children);
                }
                else {
                    elStr += '[]';
                }
                elStr += ')';
                if (ast.forStatment) {
                    ex = true;
                    str += transformFor(ast);
                }
                if (ast.if && !ast.forStatment) {
                    ex = true;
                    str = `${ast.if.value} ? ${str + elStr} : _SUGAR._e()`;
                }
                if (ast.loading && !ast.forStatment) {
                    ex = true;
                    const loadingRender = generate(transform(toAst(`<div class="s-loading" s-if="${ast.loading.value}">
        <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`), {
                        sIf
                    }));
                    str = `_SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${str + (!ast.if ? elStr : '')},${loadingRender}])`;
                }
                if (ast.htmlStatment) {
                    ex = true;
                    str = `_SUGAR._c('div',{attrs:{${dealAttr(props)}},on:{${dealEvent(props)}}},[_SUGAR._html(${ast.htmlStatment.value.content})])`;
                }
                if (!ex) {
                    str += elStr;
                }
            }
            else if (ast.type === 5 /* NodeTypes.INTERPOLATION */) {
                str += `_SUGAR._v(_SUGAR._s(${ast.content.content}))`;
            }
            else if (ast.type === 2 /* NodeTypes.TEXT */) {
                str += `_SUGAR._v(decodeURIComponent("${encodeURIComponent(ast.content)}"))`;
            }
            return str;
        }
        return getElm(ast);
        function transformFor(ast) {
            const forStatment = ast.forStatment;
            const props = ast.props;
            let son = `_SUGAR._c('${ast.tag}',{ `;
            son += '"attrs":{';
            son += dealAttr(props);
            son += '},"on":{';
            son += dealEvent(props);
            son += '}},[';
            ast.children.forEach((astChild, index) => {
                son += generate(astChild);
                if (index < ast.children.length - 1) {
                    son += ',';
                }
                else {
                    son += '])';
                }
            });
            if (ast.children.length === 0) {
                son += '])';
            }
            props.forEach((prop) => {
                if (prop.name === 's-if') {
                    son = `${prop.value.content} ? ${son} : _SUGAR._e()`;
                }
                if (prop.name === 's-loading') {
                    const loadingRender = generate(transform(toAst(`<div class="s-loading" s-if="${ast.loading.value}">
        <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`), {
                        sIf
                    }));
                    son = `_SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${son},${loadingRender}])`;
                }
            });
            return `..._SUGAR._loop((${forStatment.item}${forStatment.index ? ',' + forStatment.index : ''})=>{
        return ${son}
                            },${forStatment.exp})`;
        }
    }
    function dealAttr(props) {
        let str = '';
        props = props.filter(prop => {
            return prop.name !== 's-if' && prop.name !== 's-for' && prop.name !== 'on' && prop.name !== 's-loading' && prop.name !== 's-html';
        });
        props.forEach((prop, index) => {
            if (prop.name !== 's-if' && prop.name !== 's-for' && prop.name !== 'on' && prop.name !== 'bind' && prop.name !== 'slot' && prop.name !== 's-html') {
                str += `"${prop.name}":"${prop.value.content}"`;
            }
            else if (prop.name === 'bind') {
                str += `"${prop.arg.content}":${prop.exp.content}`;
            }
            else if (prop.name === 'slot') {
                str += `"slot":"${prop.arg.content}"`;
            }
            if (prop.name !== 's-if' && prop.name !== 's-for' && prop.name !== 'on' && index < props.length - 1) {
                str += ',';
            }
        });
        return str;
    }
    function dealEvent(props) {
        let str = '';
        props = props.filter(prop => {
            return prop.name === 'on';
        });
        props.forEach((prop, index) => {
            if (prop.name === 'on') {
                let funString = `"${prop.exp.content}"`;
                if (prop.exp.isStatic) {
                    funString = `(e)=>{${prop.exp.content}}`;
                }
                str += `"${prop.arg.content}":{"value":${funString},"isStatic":${prop.exp.isStatic}${prop.exp.parameters ? `,"parameters":[${prop.exp.parameters}]` : ''},"modifiers":[${Array2String(prop.modifiers)}]}`;
                if (prop.name === 'on' && index < props.length - 1) {
                    str += ',';
                }
            }
        });
        return str;
    }
    function Array2String(arr) {
        if (!isArray(arr)) {
            return '';
        }
        return arr.map((a) => {
            return `"${a}"`;
        });
    }

    function sFor(context, prop) {
        const forMatch = prop.value.content.split(' in ');
        const reg = /(?<=\()(.+?)(?=\))/;
        forMatch[0] = forMatch[0].match(reg) ? forMatch[0].match(reg)[0].split(',') : forMatch[0];
        context.forStatment = {
            exp: forMatch[1],
            item: isArray(forMatch[0]) ? forMatch[0][0] : forMatch[0],
            index: isArray(forMatch[0]) ? forMatch[0][1] : null
        };
    }

    function sHtml(context, prop) {
        context.htmlStatment = {
            value: prop.value
        };
    }

    function sLoading(context, prop) {
        context.loading = {
            value: prop.value.content,
            type: prop.value.type
        };
    }

    function transformEvent(content, prop) {
        if (prop.exp.content.includes('(') && prop.exp.content.includes(')')) {
            const eventStr = prop.exp.content;
            prop.exp.content = prop.exp.content.substring(0, eventStr.indexOf('('));
            prop.exp.parameters = eventStr.substring(eventStr.indexOf('(') + 1, eventStr.length - 1).split(',');
        }
    }

    function baseCompile(template) {
        const ast = toAst(template);
        transform(ast, {
            sIf,
            sFor,
            sHtml,
            sLoading,
            transformEvent
        });
        return {
            root: ast,
            code: generate(ast)
        };
    }

    function sugarCompiler(template) {
        function compile(template = '') {
            const { code, root } = baseCompile(template);
            return {
                code: createFunction(code),
                root
            };
        }
        function createFunction(code = '') {
            return new Function(`
            with(this) {
              return ${code};
            }
        `);
        }
        return compile(template);
    }

    function isComponent(vnode, components) {
        return !!components[vnode.tag];
    }

    const componentCache = {};
    function addComponentCache(sugar, key) {
        componentCache[key] = sugar;
    }
    function getComponentCache(key) {
        return componentCache[key];
    }

    function bulkComponent(_vnode, parentComponent) {
        const { data: { attrs, on }, children } = _vnode;
        const _sugar = deepClone(parentComponent);
        const props = {};
        const slot = children;
        Object.keys(attrs).forEach((propName) => {
            if (propName !== 'instance') {
                const [tempGet, tempSet] = useState(attrs[propName]);
                props[propName] = tempGet;
                props[propName + '_sugar_setState'] = tempSet;
            }
        });
        Object.keys(on).forEach((propName) => {
            if (on[propName].parameters) {
                props[propName] = function () {
                    on[propName].fun(...on[propName].parameters);
                };
            }
            else {
                props[propName] = on[propName].fun;
            }
        });
        if (_vnode.key && getComponentCache(_vnode.key)) {
            return getComponentCache(_vnode.key);
        }
        const app = makeComponent(Object.assign(Object.assign({}, _sugar), { props,
            slot }));
        app.mount();
        _vnode.key && addComponentCache(app, _vnode.key);
        return app;
    }
    function makeComponent(instance) {
        const appId = guid();
        updateActiveId(appId);
        const data = instance.bulk(instance.props);
        const { mounted } = componentRender();
        let update = null;
        const vm = {
            render: instance.render,
            _vnode: null,
            data,
            $el: null,
            appId,
            components: instance.components ? instance.components : [],
            sugar: {},
            slot: instance.slot,
            props: instance.props
        };
        function mount() {
            var _a;
            update = mounted(vm, data);
            (_a = mountHandleList[appId]) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
                item.fun();
                item.used = true;
            });
        }
        function updateSlot(slot) {
            vm.slot = slot;
        }
        function forceUpdate() {
            update();
        }
        return Object.assign(Object.assign({ vm,
            mount }, data), { updateSlot,
            forceUpdate });
    }
    function componentRender() {
        let render = null;
        function mounted(vm, data) {
            const htmlCode = vm.render;
            const { code, root } = sugarCompiler(htmlCode);
            vm.$el = document.createElement(root.tag);
            vm._vnode = vm.$el;
            render = code;
            bindT(vm, data);
            update(vm);
            Object.values(data).forEach((item) => {
                if (typeof item === 'object' && item.sugarRefDataType === 'useState') {
                    item.initDep(() => {
                        update(vm);
                    });
                }
            });
            vm.forceUpdate = function () {
                update(vm);
            };
            update(vm);
            return vm.forceUpdate;
        }
        function update(vm) {
            const vnode = render.call(VmDataRefPassive(vm));
            bindAttrAndEvent(vm, vnode);
            assembling(vnode, vm.slot);
            patch(vm, vnode);
            vm._vnode = vnode;
        }
        function assembling(_n, slot) {
            _n.children.forEach((child, index) => {
                var _a, _b, _c, _d;
                if (child.tag === 'slot' && (((_a = child.data.attrs) === null || _a === void 0 ? void 0 : _a.name) === 'default') && isDefault(slot)) {
                    _n.children.splice(index, 1, ...slot);
                }
                else if (child.tag === 'slot' && ((_b = child.data.attrs) === null || _b === void 0 ? void 0 : _b.name)) {
                    const NamedSlots = slot.filter((s) => {
                        var _a;
                        return ((_a = s.data) === null || _a === void 0 ? void 0 : _a.attrs.slot) === child.data.attrs.name;
                    });
                    _n.children.splice(index, 1, ...NamedSlots);
                }
                else if (child.tag === 'slot' && !((_c = child.data.attrs) === null || _c === void 0 ? void 0 : _c.name)) {
                    const NoNamedSlots = slot.filter((s) => {
                        var _a;
                        return !((_a = s.data) === null || _a === void 0 ? void 0 : _a.attrs.slot);
                    });
                    _n.children.splice(index, 1, ...NoNamedSlots);
                }
                else if ((_d = child.children) === null || _d === void 0 ? void 0 : _d.length) {
                    assembling(child, slot);
                }
            });
        }
        function isDefault(slots) {
            return slots.filter((slot) => {
                var _a, _b;
                return (_b = (_a = slot.data) === null || _a === void 0 ? void 0 : _a.attrs) === null || _b === void 0 ? void 0 : _b.slot;
            });
        }
        return {
            update,
            mounted
        };
    }

    function patch(vm, newVnode) {
        var _a;
        let oldVnode = vm._vnode;
        if (!oldVnode.elm) {
            oldVnode = emptyNodeAt(oldVnode);
        }
        if (isSameNode(oldVnode, newVnode)) {
            patchVnode(newVnode, oldVnode);
        }
        else {
            if (((_a = oldVnode.elm) === null || _a === void 0 ? void 0 : _a.parentNode) && newVnode) {
                nodeOps.insert(createElement(newVnode), nodeOps.parentNode(oldVnode.elm), oldVnode.elm);
                nodeOps.remove(oldVnode.elm);
            }
        }
        function createElement(vnode) {
            let domNode;
            if (vnode.tag) {
                if (typeof vnode.tag === 'string' && !isComponent(vnode, vm.components)) {
                    if (vnode.tag === 'svg' || vnode.tag === 'path') {
                        domNode = document.createElementNS('http://www.w3.org/2000/svg', vnode.tag);
                    }
                    else {
                        domNode = document.createElement(vnode.tag);
                    }
                    const { data = {} } = vnode || {};
                    const { attrs = {}, on = {} } = data;
                    // 处理属性
                    for (const key in attrs) {
                        if (Object.hasOwnProperty.call(attrs, key)) {
                            const value = attrs[key];
                            domNode.setAttribute(key, value);
                            if (key === 'instance') {
                                if (vm[value]) {
                                    vm[value].value = domNode;
                                }
                            }
                        }
                    }
                    const _vei = domNode._vei || (domNode._vei = {});
                    // 处理监听事件
                    for (const key in on) {
                        if (Object.hasOwnProperty.call(on, key)) {
                            if (on[key].value) {
                                const event = on[key].fun;
                                event && domNode.addEventListener(key, event);
                                _vei[key] = event;
                            }
                        }
                    }
                    if (vnode.children) {
                        for (let i = 0; i < vnode.children.length; i++) {
                            const childrenDom = createElement(vnode.children[i]);
                            if (childrenDom) {
                                domNode.append(childrenDom);
                            }
                        }
                    }
                }
                else if (isComponent(vnode, vm.components)) {
                    const app = bulkComponent(vnode, vm.components[vnode.tag]);
                    vnode.elm = app.vm.$el;
                    vnode._sugar = app;
                    domNode = vnode.elm;
                }
            }
            else if (vnode.text !== undefined) {
                domNode = document.createTextNode(vnode.text);
            }
            else if (vnode.elm !== undefined) {
                domNode = vnode.elm;
            }
            vnode.elm = domNode;
            return domNode;
        }
        function patchVnode(newVnode, oldVnode) {
            var _a;
            if (isComponent(newVnode, vm.components)) {
                updateComponent(newVnode, oldVnode);
                bindComponentInstance(newVnode, vm);
                return;
            }
            newVnode.elm = oldVnode.elm;
            if (newVnode.text) {
                if (oldVnode.text !== newVnode.text) {
                    oldVnode.elm.nodeValue = newVnode.text;
                }
            }
            else if (newVnode.tag) {
                patchProps(newVnode, oldVnode, vm);
                if ((_a = oldVnode.children) === null || _a === void 0 ? void 0 : _a.length) {
                    updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
                }
                else if (newVnode.children.length > 0) {
                    oldVnode.elm.innerHTML = '';
                    for (let i = 0; i < newVnode.children.length; i++) {
                        const child = createElement(newVnode.children[i]);
                        if (child) {
                            oldVnode.elm.appendChild(child);
                        }
                    }
                }
            }
        }
        function patchProps(newVnode, oldVnode, vm) {
            const attrs = newVnode.data.attrs;
            const on = newVnode.data.on;
            const oldAttrs = oldVnode.data.attrs;
            const elm = newVnode.elm;
            patchAttrs(elm, oldAttrs, attrs, vm);
            patchEvents(elm, on);
        }
        function patchAttrs(el, oldAttrs, newAttrs, vm) {
            if (oldAttrs) {
                Object.keys(oldAttrs).forEach((attr) => {
                    if (newAttrs[attr] !== oldAttrs[attr]) {
                        el.removeAttribute(attr);
                    }
                });
            }
            Object.keys(newAttrs).forEach((attr) => {
                if (attr === 'value') {
                    el.value = newAttrs[attr];
                }
                if (!oldAttrs || newAttrs[attr] !== oldAttrs[attr]) {
                    el.setAttribute(attr, newAttrs[attr]);
                }
                if (attr === 'instance') {
                    if (vm[newAttrs[attr]]) {
                        vm[newAttrs[attr]].value = el;
                    }
                }
            });
        }
        function updateChildren(parentDom, oldCh, newCh) {
            var _a;
            oldCh = clearEmptyVnode(oldCh);
            newCh = clearEmptyVnode(newCh);
            // 旧前
            let oldPreIndex = 0;
            // 旧后
            let oldAftIndex = oldCh.length - 1;
            // 新前
            let newPreIndex = 0;
            // 新后
            let newAftIndex = newCh.length - 1;
            // 旧前节点
            let oldSNode = oldCh[oldPreIndex];
            // 旧后节点
            let oldENode = oldCh[oldAftIndex];
            // 新前节点
            let newSNode = newCh[newPreIndex];
            // 新后节点
            let newENode = newCh[newAftIndex];
            let oldKeyToIdx, idxInOld, elmToMove, refElm;
            while (oldPreIndex <= oldAftIndex && newPreIndex <= newAftIndex) {
                if (!oldSNode || !oldCh[oldPreIndex]) {
                    oldSNode = oldCh[++oldPreIndex];
                }
                else if (!oldENode || !oldCh[oldAftIndex]) {
                    oldENode = oldCh[--oldAftIndex];
                }
                else if (!newSNode || !newCh[newPreIndex]) {
                    newSNode = newCh[++newPreIndex];
                }
                else if (!newENode || !newCh[newAftIndex]) {
                    newENode = newCh[--newAftIndex];
                }
                else if (isSameNode(newSNode, oldSNode)) {
                    patchVnode(newSNode, oldSNode);
                    oldSNode = oldCh[++oldPreIndex];
                    newSNode = newCh[++newPreIndex];
                    // 新前与旧后
                }
                else if (isSameNode(newSNode, oldENode)) {
                    patchVnode(newSNode, oldENode);
                    parentDom.insertBefore(oldENode.elm, oldSNode.elm);
                    oldENode = oldCh[--oldAftIndex];
                    newSNode = newCh[++newPreIndex];
                    // 新后与旧前
                }
                else if (isSameNode(newENode, oldSNode)) {
                    patchVnode(newENode, oldSNode);
                    parentDom.insertBefore(oldSNode.elm, oldENode.elm.nextSibling);
                    oldSNode = oldCh[++oldPreIndex];
                    newENode = newCh[--newAftIndex];
                    // 新后与旧后
                }
                else if (isSameNode(newENode, oldENode)) {
                    patchVnode(newENode, oldENode);
                    oldENode = oldCh[--oldAftIndex];
                    newENode = newCh[--newAftIndex];
                }
                else {
                    if (isUndef(oldKeyToIdx))
                        oldKeyToIdx = createKeyToOldIdx(oldCh, oldPreIndex, oldAftIndex);
                    idxInOld = isDef(newSNode.key) ? oldKeyToIdx[newSNode.key] : null;
                    if (isUndef(idxInOld)) {
                        parentDom.insertBefore(createElement(newSNode), oldSNode.elm);
                        newSNode = newCh[++newPreIndex];
                    }
                    else {
                        elmToMove = oldCh[idxInOld];
                        if (isSameNode(elmToMove, newSNode)) {
                            patchVnode(newSNode, elmToMove);
                            oldCh[idxInOld] = undefined;
                            parentDom.insertBefore(elmToMove.elm, oldSNode.elm);
                        }
                        else {
                            parentDom.insertBefore(createElement(newSNode), oldSNode.elm);
                        }
                        newSNode = newCh[++newPreIndex];
                    }
                }
            }
            if (oldPreIndex > oldAftIndex) {
                refElm = isUndef(newCh[newAftIndex + 1]) ? null : newCh[newAftIndex + 1].elm;
                for (; newPreIndex <= newAftIndex; newPreIndex++) {
                    if (refElm) {
                        parentDom.insertBefore(createElement(newCh[newPreIndex]), refElm);
                    }
                    else {
                        parentDom.append(createElement(newCh[newPreIndex]));
                    }
                }
            }
            if (newPreIndex > newAftIndex) {
                for (let i = oldPreIndex; i <= oldAftIndex; i++) {
                    if ((_a = oldCh[i]) === null || _a === void 0 ? void 0 : _a.elm) {
                        parentDom.removeChild(oldCh[i].elm);
                    }
                }
            }
        }
        function createKeyToOldIdx(children, beginIdx, endIdx) {
            let i, key;
            const map = {};
            for (i = beginIdx; i <= endIdx; ++i) {
                key = children[i].key;
                if (isDef(key))
                    map[key] = i;
            }
            return map;
        }
    }
    function updateComponent(newVnode, oldVnode) {
        Object.keys(oldVnode._sugar.vm.props).forEach(prop => {
            const { attrs, on } = newVnode.data;
            if (Object.keys(attrs).includes(prop)) {
                oldVnode._sugar.vm.props[prop + '_sugar_setState'](newVnode.data.attrs[prop]);
            }
            else if (Object.keys(on).includes(prop)) {
                if (newVnode.data.on[prop].parameters) {
                    oldVnode._sugar.vm.props[prop] = function () {
                        newVnode.data.on[prop].fun(...newVnode.data.on[prop].parameters);
                    };
                }
                else {
                    oldVnode._sugar.vm.props[prop] = newVnode.data.on[prop].fun;
                }
            }
        });
        oldVnode._sugar.updateSlot(newVnode.children);
        if (oldVnode._sugar) {
            oldVnode._sugar.forceUpdate();
        }
        newVnode.elm = oldVnode.elm;
        newVnode._sugar = oldVnode._sugar;
    }
    function emptyNodeAt(elm) {
        return new VNode$1(elm.tagName.toLowerCase(), {}, [], elm);
    }
    function isSameNode(o, n) {
        return o.key === n.key && o.tag === n.tag;
    }
    function patchEvents(el, newOn) {
        const _vei = el._vei || (el._vei = {});
        Object.keys(_vei).forEach((eventName) => {
            el.removeEventListener(eventName, _vei[eventName]);
        });
        Object.keys(newOn).forEach((eventName) => {
            _vei[eventName] = newOn[eventName].fun;
            el.addEventListener(eventName, newOn[eventName].fun);
        });
    }
    function clearEmptyVnode(Vnodes) {
        return Vnodes.filter((Vnode) => {
            return Vnode.tag || Vnode.text === '' || Vnode.text || Vnode.elm;
        });
    }
    function bindComponentInstance(vNode, vm) {
        const data = vNode.data;
        if (data) {
            const attrs = data.attrs;
            if (attrs.instance) {
                vm[attrs.instance].value = vNode.elm;
            }
        }
        if (vNode.children) {
            vNode.children.forEach((child) => {
                bindComponentInstance(child, vm);
            });
        }
    }
    let VNode$1 = class VNode {
        constructor(tag, data, children, elm) {
            var _a;
            this.tag = tag;
            this.data = data;
            // @ts-expect-error
            this.children = children;
            this.key = (_a = data.attrs) === null || _a === void 0 ? void 0 : _a.key;
            this.elm = elm;
            this.context = undefined;
            this.text = undefined;
        }
    };

    function sugarRender() {
        let render = null;
        function mounted(vm, data) {
            const serializer = new XMLSerializer();
            const htmlCode = vm.render ? vm.render : escape2Html(serializer.serializeToString(vm.$el));
            const { code } = sugarCompiler(htmlCode);
            render = code;
            pushUiEffect(vm, data);
        }
        function pushUiEffect(vm, data) {
            bindT(vm, data);
            Object.values(data).forEach((item) => {
                if (typeof item === 'object' && item.sugarRefDataType === 'useState') {
                    item.initDep(() => {
                        update(vm);
                    });
                }
            });
            vm.forceUpdate = function () {
                update(vm);
            };
            update(vm);
        }
        function update(vm) {
            const vmFiber = VmDataRefPassive(vm);
            const vnode = render.call(vmFiber);
            bindAttrAndEvent(vmFiber, vnode);
            patch(vmFiber, vnode);
            vmFiber._vnode = vnode;
        }
        return {
            update,
            mounted
        };
    }
    function VmDataRefPassive(vm) {
        const refObj = {};
        Object.keys(vm).forEach((key) => {
            var _a;
            if (((_a = vm[key]) === null || _a === void 0 ? void 0 : _a.sugarRefDataType) === 'useState') {
                Object.defineProperty(refObj, key, {
                    get() {
                        return vm[key].value;
                    },
                    set(val) {
                        console.log('useState can not set value in render');
                    }
                });
            }
            else {
                Object.defineProperty(refObj, key, {
                    get() {
                        return vm[key];
                    },
                    set(val) {
                        vm[key] = val;
                    }
                });
            }
        });
        return refObj;
    }
    function bindT(vm, data) {
        Object.keys(data).forEach((key) => {
            vm[key] = data[key];
        });
        function _c(tag = 'div', data = {}, children = []) {
            return createElement(tag, data, children);
        }
        function _v(str) {
            const vnode = new VNode();
            vnode.text = str;
            return vnode;
        }
        function _s(val) {
            return String(val);
        }
        function _e() {
            return {
                tag: 'div',
                data: {
                    attrs: {
                        class: 's-block'
                    },
                    on: {}
                },
                children: [],
                elm: {
                    _vei: {}
                }
            };
        }
        function _html(html) {
            return html2Vnode(html);
        }
        function _loop(fun, data) {
            const nodes = [];
            data.forEach((item, index) => {
                nodes.push(Object.assign({}, fun(item, index)));
            });
            return nodes;
        }
        vm._SUGAR = {
            _c,
            _v,
            _s,
            _e,
            _loop,
            _html
        };
    }
    function createElement(tag = 'div', data = {}, children = []) {
        const createVNode = (tag = 'div', data = {}, children = []) => {
            const vnodeChildren = [];
            if (children && (children.length > 0)) {
                children.forEach((child) => {
                    vnodeChildren.push(child);
                });
            }
            return new VNode(tag, data, vnodeChildren);
        };
        // render函数中执行_c，接收参数，创建vnode
        return createVNode(tag, data, children);
    }
    class VNode {
        constructor(tag, data, children) {
            var _a;
            this.tag = tag;
            this.data = data;
            // @ts-expect-error
            this.children = children;
            this.elm = undefined;
            this.context = undefined;
            this.text = undefined;
            this.key = (_a = data === null || data === void 0 ? void 0 : data.attrs) === null || _a === void 0 ? void 0 : _a.key;
        }
    }
    function bindAttrAndEvent(vm, vnode) {
        if (vnode.static) {
            return;
        }
        const { data = {} } = vnode || {};
        const { on = {} } = data;
        if (vnode === null || vnode === void 0 ? void 0 : vnode.tag) {
            // 处理监听事件
            for (const key in on) {
                if (Object.hasOwnProperty.call(on, key)) {
                    if (on[key].value && !on[key].isStatic) {
                        on[key].value = vm.data[on[key].value];
                        on[key].fun = function (e) {
                            var _a, _b;
                            if (on[key].modifiers.includes('self')) {
                                if (e.target !== e.currentTarget) {
                                    return;
                                }
                            }
                            const parameters = on[key].parameters;
                            if (parameters === null || parameters === void 0 ? void 0 : parameters.length) {
                                on[key].value(...parameters);
                            }
                            else {
                                if (((_a = e.target) === null || _a === void 0 ? void 0 : _a.nodeType) === 1 && ((_b = on[key].value) === null || _b === void 0 ? void 0 : _b.sugarRefDataType) === 'setState') {
                                    on[key].value(e.target.value);
                                }
                                else {
                                    on[key].value(e);
                                }
                            }
                            if (on[key].modifiers.includes('stop')) {
                                e.stopPropagation();
                            }
                            if (on[key].modifiers.includes('prevent')) {
                                e.preventDefault();
                            }
                        };
                    }
                    else {
                        on[key].fun = on[key].value;
                    }
                }
            }
            if (vnode.children) {
                for (let i = 0; i < vnode.children.length; i++) {
                    if (vnode.children[i].appId) {
                        bindAttrAndEvent(vm.sugar[vnode.children[i].appId].vm, vnode.children[i]);
                    }
                    else {
                        bindAttrAndEvent(vm, vnode.children[i]);
                    }
                }
            }
        }
    }
    function html2Vnode(html) {
        function work(dom) {
            const attr = {
                attrs: {},
                on: {}
            };
            Array.from(dom.attributes).forEach((item) => {
                attr.attrs[item.name] = item.value;
            });
            const vNode = createElement(dom.tagName, attr, []);
            Array.from(dom.childNodes).forEach((child) => {
                if (child.nodeType === 1) {
                    vNode.children.push(work(child));
                }
                else if (child.nodeType === 3) {
                    vNode.children.push({
                        tag: '',
                        content: child.textContent,
                        children: [],
                        elm: undefined,
                        text: child.textContent,
                        key: undefined,
                        data: undefined
                    });
                }
            });
            return vNode;
        }
        const div = document.createElement('div');
        div.innerHTML = html;
        return work(div);
    }

    function instance() {
        const result = {};
        const data = {
            value: null
        };
        return Object.defineProperty(result, 'value', {
            get() {
                return data.value;
            },
            set(newValue) {
                if (newValue !== data.value) {
                    data.value = newValue;
                }
            }
        });
    }

    const callbacks = [];
    const timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    };
    function flushCallbacks() {
        const copies = callbacks.slice(0);
        callbacks.length = 0;
        for (let i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    function nextTick(cb) {
        callbacks.push(() => {
            if (cb) {
                cb();
            }
        });
        timerFunc();
    }

    function initCSS() {
        addCSS(`
      .s-block{
        display:none;
      }
  
      .s-loading{
        position: absolute;
        background: rgba(255,255,255,0.8);
        z-index: 99999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .s-loading svg{
        animation: sLoading 1s linear infinite;
      }
  
      @keyframes sLoading {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
  
  `);
    }

    function makeSugar(options) {
        const appId = guid();
        updateActiveId(appId);
        const data = options.bulk(options.props);
        const $ = {};
        const { mounted } = sugarRender();
        const vm = {
            render: options.render,
            _vnode: null,
            data,
            $el: null,
            appId,
            components: [],
            sugar: {},
            slot: options.slot
        };
        function mount(el) {
            initCSS();
            vm._vnode = vm.$el = typeof el === 'string' ? document.querySelector(`${el}`) : el;
            mounted(vm, data);
            nextTick(() => {
                var _a;
                (_a = mountHandleList[appId]) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
                    item.fun();
                    item.used = true;
                });
            });
        }
        function install(components) {
            components.forEach((component) => {
                if (component.name) {
                    vm.components[component.name] = component;
                    vm.components[component.name].components = vm.components;
                }
                else if (component.fun) {
                    $[component.fun] = component.bulk;
                }
            });
        }
        return Object.assign(Object.assign({ vm,
            mount }, data), { install,
            $ });
    }

    if (typeof window !== 'undefined') {
        (function (global) {
            global.SUGAR = {
                onMounted,
                makeSugar,
                instance,
                useState,
                useEffect,
                nextTick
            };
        })(window);
    }

    exports.instance = instance;
    exports.makeSugar = makeSugar;
    exports.nextTick = nextTick;
    exports.onMounted = onMounted;
    exports.useEffect = useEffect;
    exports.useState = useState;

}));
//# sourceMappingURL=sugar.js.map
