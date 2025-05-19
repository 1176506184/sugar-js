// packages/sugar-compiler/src/utils.ts
var isArray = Array.isArray;
var extend = Object.assign;
function isSimpleIdentifier(exp) {
  return /^[A-Za-z_$][\w$]*$/.test(exp);
}
function isStaticExpression(exp) {
  if (isSimpleIdentifier(exp)) {
    return true;
  }
  const dynamicKeywords = ["(", ")", "=>", "+", "-", "*", "/", ".", "[", "]"];
  for (const keyword of dynamicKeywords) {
    if (exp.includes(keyword)) {
      return false;
    }
  }
  return true;
}

// packages/sugar-compiler/src/parse.ts
var globalScope = /* @__PURE__ */ new Set([]);
function parse(context, ancestors) {
  const parent = last(ancestors);
  const nodes = [];
  while (!isEnd(context, ancestors)) {
    const s = context.source;
    let node;
    if (startsWith(s, context.options.delimiters[0])) {
      node = parseInterpolation(context);
    } else if (s[0] === "<") {
      if (s.length === 1) {
      } else if (s[1] === "/") {
        if (s[2] === ">") {
          advanceBy(context, 3);
          continue;
        } else if (/[a-z]/i.test(s[2])) {
          parseTag(context, 1 /* End */, parent);
          continue;
        } else {
          node = parseComment(context);
        }
      } else if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors);
      } else if (s[1] === "!") {
        node = parseComment(context);
      }
    }
    if (!node) {
      node = parseText(context);
    }
    if (isArray(node)) {
      for (let i = 0; i < node.length; i++) {
        pushNode(nodes, node[i]);
      }
    } else {
      pushNode(nodes, node);
    }
  }
  let removedWhitespace = false;
  const shouldCondense = context.options.whitespace !== "preserve";
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === 2 /* TEXT */) {
      if (!context.inPre) {
        if (!/[^\t\r\n\f ]/.test(node.content)) {
          const prev = nodes[i - 1];
          const next = nodes[i + 1];
          if (!prev || !next || shouldCondense && (prev.type === 3 /* COMMENT */ && next.type === 3 /* COMMENT */ || prev.type === 3 /* COMMENT */ && next.type === 1 /* ELEMENT */ || prev.type === 1 /* ELEMENT */ && next.type === 3 /* COMMENT */ || prev.type === 1 /* ELEMENT */ && next.type === 1 /* ELEMENT */ && /[\r\n]/.test(node.content))) {
            removedWhitespace = true;
            nodes[i] = null;
          } else {
            node.content = " ";
          }
        } else if (shouldCondense) {
          node.content = node.content.replace(/[\t\r\n\f ]+/g, " ");
        }
      } else {
        node.content = node.content.replace(/\r\n/g, "\n");
      }
    } else if (node.type === 3 /* COMMENT */ && !context.options.comments) {
      removedWhitespace = true;
      nodes[i] = null;
    }
  }
  if (context.inPre && parent && context.options.isPreTag(parent.tag)) {
    const first = nodes[0];
    if (first && first.type === 2 /* TEXT */) {
      first.content = first.content.replace(/^\r?\n/, "");
    }
  }
  return removedWhitespace ? nodes.filter(Boolean) : nodes;
}
function parseAttributes(context, type) {
  const props = [];
  const attributeNames = /* @__PURE__ */ new Set();
  const firstTagMatch = context.source.slice(0, context.source.indexOf(">")).match(/s-for\s*=\s*["']\s*\(([^)]+)\)\s+in\s+[^"']+["']/);
  if (firstTagMatch) {
    const aliases = firstTagMatch[1].split(",").map((s) => s.trim());
    for (const alias of aliases) {
      globalScope.add(alias);
    }
  }
  while (context.source.length > 0 && !startsWith(context.source, ">") && !startsWith(context.source, "/>")) {
    if (startsWith(context.source, "/")) {
      advanceBy(context, 1);
      advanceSpaces(context);
      continue;
    }
    const attr = parseAttribute(context, attributeNames);
    if (["s-if", "s-html"].includes(attr.name)) {
      attr.value.content = bindCtx(attr.value.content);
    }
    if (attr.name === "s-for") {
      const tar = attr.value.content.split(" in ");
      attr.value.content = tar[0] + " in " + bindCtx(tar[1]);
    }
    if (attr.type === 6 /* ATTRIBUTE */ && attr.value && attr.name === "class") {
      attr.value.content = attr.value.content.replace(/\s+/g, " ").trim();
    }
    if (type === 0 /* Start */) {
      props.push(attr);
    }
    advanceSpaces(context);
  }
  return props;
}
function parseAttribute(context, nameSet) {
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
    const match2 = /(?:^v-([a-z0-9-]+))?(?:(?::|^\.|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(
      name
    );
    const isPropShorthand = startsWith(name, ".");
    const dirName = match2[1] || (isPropShorthand || startsWith(name, ":") ? "bind" : startsWith(name, "@") || startsWith(name, "s-on:") ? "on" : "slot");
    let arg;
    if (match2[2]) {
      const isSlot = dirName === "slot";
      const startOffset = name.lastIndexOf(
        match2[2],
        name.length - (match2[3]?.length || 0)
      );
      const loc2 = getSelection(
        context,
        getNewPosition(context, start, startOffset),
        getNewPosition(
          context,
          start,
          startOffset + match2[2].length + (isSlot && match2[3] || "").length
        )
      );
      let content = match2[2];
      if (content.startsWith("[")) {
        if (!content.endsWith("]")) {
          content = content.slice(1);
        } else {
          content = content.slice(1, content.length - 1);
        }
      } else if (isSlot) {
        content += match2[3] || "";
      }
      arg = {
        type: 4 /* SIMPLE_EXPRESSION */,
        content,
        loc: loc2
      };
    }
    if (value?.isQuoted) {
      const valueLoc = value.loc;
      valueLoc.start.offset++;
      valueLoc.start.column++;
      valueLoc.end = advancePosWithClone(valueLoc.start, value.content);
      valueLoc.source = valueLoc.source.slice(1, -1);
    }
    const modifiers = match2[3] ? match2[3].slice(1).split(".") : [];
    if (isPropShorthand) modifiers.push("prop");
    return {
      type: 7 /* DIRECTIVE */,
      name: dirName,
      exp: value && {
        type: 4 /* SIMPLE_EXPRESSION */,
        content: bindCtx(value.content),
        loc: value.loc,
        isStatic: !isStaticExpression(value.content)
      },
      arg,
      modifiers,
      loc
    };
  }
  return {
    type: 6 /* ATTRIBUTE */,
    name,
    value: value && {
      type: 2 /* TEXT */,
      content: value.content,
      loc: value.loc
    },
    loc
  };
}
function getNewPosition(context, start, numberOfCharacters) {
  return advancePosWithClone(
    start,
    context.originalSource.slice(start.offset, numberOfCharacters),
    numberOfCharacters
  );
}
function parseAttributeValue(context) {
  const start = getPos(context);
  let content;
  const quote = context.source[0];
  const isQuoted = quote === '"' || quote === "'";
  if (isQuoted) {
    advanceBy(context, 1);
    const endIndex = context.source.indexOf(quote);
    if (endIndex === -1) {
      content = parseTextData(
        context,
        context.source.length
      );
    } else {
      content = parseTextData(context, endIndex);
      advanceBy(context, 1);
    }
  } else {
    const match = /^[^\t\r\n\f >]+/.exec(context.source);
    if (!match) {
      return void 0;
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
  if (node.type === 2 /* TEXT */) {
    const prev = last(nodes);
    if (prev && prev.type === 2 /* TEXT */ && prev.loc.end.offset === node.loc.start.offset) {
      prev.content += node.content;
      prev.loc.end = node.loc.end;
      prev.loc.source += node.loc.source;
      return;
    }
  }
  nodes.push(node);
}
function parseElement(context, ancestors) {
  const parent = last(ancestors);
  const element = parseTag(context, 0 /* Start */, parent);
  if (element.isSelfClosing || context.options.isVoidTag(element.tag)) {
    return element;
  }
  ancestors.push(element);
  const children = parse(context, ancestors);
  ancestors.pop();
  element.children = children;
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, 1 /* End */, parent);
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
    isSelfClosing = startsWith(context.source, "/>");
    advanceBy(context, isSelfClosing ? 2 : 1);
  }
  if (type === 1 /* End */) {
    globalScope.clear();
    return;
  }
  const tagType = 0 /* ELEMENT */;
  return {
    type: 1 /* ELEMENT */,
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
  const contentStart = context.source[1] === "?" ? 1 : 2;
  let content;
  const closeIndex = context.source.indexOf("-->") + 2;
  if (closeIndex === -1) {
    content = context.source.slice(contentStart);
    advanceBy(context, context.source.length);
  } else {
    content = context.source.slice(contentStart, closeIndex);
    advanceBy(context, closeIndex + 1);
  }
  return {
    type: 3 /* COMMENT */,
    content,
    loc: getSelection(context, start)
  };
}
function isEnd(context, ancestors) {
  const s = context.source;
  if (startsWith(s, "</")) {
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
    type: 5 /* INTERPOLATION */,
    content: {
      type: 4 /* SIMPLE_EXPRESSION */,
      content: bindCtx(content),
      loc: getSelection(context, innerStart, innerEnd)
    },
    loc: getSelection(context, start)
  };
}
function parseText(context) {
  const endTokens = ["<", context.options.delimiters[0]];
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
    type: 2 /* TEXT */,
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
    if (source.charCodeAt(i) === 10) {
      linesCount++;
      lastNewLinePos = i;
    }
  }
  pos.offset += numberOfCharacters;
  pos.line += linesCount;
  pos.column = lastNewLinePos === -1 ? pos.column + numberOfCharacters : numberOfCharacters - lastNewLinePos;
  return pos;
}
function advancePosWithClone(pos, source, numberOfCharacters = source.length) {
  return advancePos(
    extend({}, pos),
    source,
    numberOfCharacters
  );
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
  return startsWith(source, "</") && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase() && /[\t\r\n\f />]/.test(source[2 + tag.length] || ">");
}
function last(xs) {
  return xs[xs.length - 1];
}
function getPos(context) {
  const {
    column,
    line,
    offset
  } = context;
  return {
    column,
    line,
    offset
  };
}
var jsGlobals = /* @__PURE__ */ new Set([
  // 原始值
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity",
  // 基本对象
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
  // 数字与数学
  "Number",
  "BigInt",
  "Math",
  "Date",
  // 文本处理
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  // Keyed collections
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Web APIs & runtime globals
  "window",
  "globalThis",
  "console",
  "alert",
  "setTimeout",
  "setInterval",
  "clearTimeout",
  "clearInterval",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  // DOM
  "document",
  "location",
  "history",
  "navigator",
  // 新语言关键字等
  "await",
  "async",
  "arguments",
  "this"
]);
function bindCtx(code) {
  return code.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, (match, varName, offset, fullText) => {
    const before = fullText.slice(0, offset);
    const inSingleQuotes = /'[^']*$/.test(before) && /[^']*'/.test(fullText.slice(offset));
    const inDoubleQuotes = /"[^"]*$/.test(before) && /[^"]*"/.test(fullText.slice(offset));
    const inBacktick = /`[^`]*$/.test(before) && /[^`]*`/.test(fullText.slice(offset));
    if (inSingleQuotes || inDoubleQuotes || inBacktick) return match;
    const prevChar = fullText[offset - 1];
    if (prevChar === "." || prevChar === ":") return match;
    if (globalScope.has(varName) || jsGlobals.has(varName)) return match;
    return `_ctx_.${varName}`;
  });
}

// packages/sugar-compiler/src/toAst.ts
var NO = (tag) => false;
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
      delimiters: ["{{", "}}"],
      isVoidTag: NO,
      isPreTag: NO,
      isCustomElement: NO,
      getNamespace: (tag, parent) => 0 /* HTML */
    }
  };
}

// packages/sugar-shared/src/index.ts
var isArray2 = (val) => val instanceof Array;
var is = {
  Array: Array.isArray,
  Date: (val) => val instanceof Date,
  Set: (val) => Object.prototype.toString.call(val) === "[object Set]",
  Map: (val) => Object.prototype.toString.call(val) === "[object Map]",
  Object: (val) => Object.prototype.toString.call(val) === "[object Object]",
  Symbol: (val) => Object.prototype.toString.call(val) === "[object Symbol]",
  Function: (val) => Object.prototype.toString.call(val) === "[object Function]"
};

// packages/sugar-compiler/src/transform.ts
function transform(context, helpers) {
  function work(context2) {
    const props = context2.props;
    props?.forEach((prop) => {
      if (prop.name === "s-if") {
        helpers.sIf(context2, prop);
      }
      if (prop.name === "s-for") {
        helpers.sFor(context2, prop);
      }
      if (prop.name === "s-html") {
        helpers.sHtml(context2, prop);
      }
      if (prop.name === "s-model") {
        helpers.sModel(context2, prop);
      }
      if (prop.name === "s-loading") {
        helpers.sLoading(context2, prop);
      }
      if (prop.name === "on") {
        helpers.transformEvent(context2, prop);
      }
    });
    if (context2.tag === "slot") {
      context2.type = 10 /* SLOT */;
    }
    if (context2.children) {
      context2.children.forEach((child) => {
        work(child);
      });
    }
  }
  work(context);
  return context;
}

// packages/sugar-compiler/src/transform/sIf.ts
function sIf(context, prop) {
  context.if = {
    value: prop.value.content,
    type: prop.value.type
  };
}

// packages/sugar-compiler/src/codegen.ts
function generate(ast) {
  const genElmChildren = (children = []) => {
    let str = "[";
    children.forEach((child, i) => {
      if (child.type === 1 /* ELEMENT */ || child.type === 5 /* INTERPOLATION */ || child.type === 10 /* SLOT */) {
        str += getElm(child) + `${i === children.length - 1 ? "" : ","}`;
      } else if (child.type === 2 /* TEXT */ && !!child.content.trim()) {
        str += getElm(child) + `${i === children.length - 1 ? "" : ","}`;
      }
    });
    return str + "]";
  };
  function getElm(ast2) {
    let str = "";
    const props = ast2.props;
    if (ast2.type === 1 || ast2.type === 10 /* SLOT */) {
      let elStr = "";
      let ex = false;
      elStr += `_ctx_._SUGAR._c('${ast2.tag}',{ `;
      elStr += '"attrs":{';
      elStr += dealAttr(props);
      elStr += '},"on":{';
      elStr += dealEvent(props);
      elStr += "}},";
      if (ast2.children) {
        elStr += genElmChildren(ast2.children);
      } else {
        elStr += "[]";
      }
      elStr += ")";
      if (ast2.forStatment) {
        ex = true;
        str += transformFor(ast2);
      }
      if (ast2.if && !ast2.forStatment) {
        ex = true;
        str = `${ast2.if.value} ? ${str + elStr} : _ctx_._SUGAR._e()`;
      }
      if (ast2.loading && !ast2.forStatment) {
        ex = true;
        const loadingRender = generate(transform(toAst(`<div class="s-loading" s-if="${ast2.loading.value}">
        <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`), {
          sIf
        }));
        str = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${str + (!ast2.if ? elStr : "")},${loadingRender}])`;
      }
      if (ast2.htmlStatment) {
        ex = true;
        str = `_ctx_._SUGAR._c('div',{attrs:{${dealAttr(props)}},on:{${dealEvent(props)}}},[_ctx_._SUGAR._html(${ast2.htmlStatment.value.content})])`;
      }
      if (!ex) {
        str += elStr;
      }
    } else if (ast2.type === 5 /* INTERPOLATION */) {
      str += `_ctx_._SUGAR._v(_ctx_._SUGAR._s(${ast2.content.content}))`;
    } else if (ast2.type === 2 /* TEXT */) {
      str += `_ctx_._SUGAR._v(decodeURIComponent("${encodeURIComponent(ast2.content)}"))`;
    }
    return str;
  }
  return getElm(ast);
  function transformFor(ast2) {
    const forStatment = ast2.forStatment;
    const props = ast2.props;
    let son = `_ctx_._SUGAR._c('${ast2.tag}',{ `;
    son += '"attrs":{';
    son += dealAttr(props);
    son += '},"on":{';
    son += dealEvent(props);
    son += "}},[";
    ast2.children.forEach((astChild, index) => {
      son += generate(astChild);
      if (index < ast2.children.length - 1) {
        son += ",";
      } else {
        son += "])";
      }
    });
    if (ast2.children.length === 0) {
      son += "])";
    }
    props.forEach((prop) => {
      if (prop.name === "s-if") {
        son = `${prop.value.content} ? ${son} : _ctx_._SUGAR._e()`;
      }
      if (prop.name === "s-loading") {
        const loadingRender = generate(transform(toAst(`<div class="s-loading" s-if="${ast2.loading.value}">
        <svg t="1734417183543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4603" width="30" height="30"><path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="4604" fill="#8a8a8a"></path></svg>
        </div>`), {
          sIf
        }));
        son = `_ctx_._SUGAR._c('div',{attrs:{style:'position:relative'},on:{}},[${son},${loadingRender}])`;
      }
    });
    return `..._ctx_._SUGAR._loop((${forStatment.item}${forStatment.index ? "," + forStatment.index : ""})=>{
        return ${son}
                            },${forStatment.exp})`;
  }
}
function dealAttr(props) {
  let str = "";
  props = props.filter((prop) => {
    return prop.name !== "s-if" && prop.name !== "s-for" && prop.name !== "on" && prop.name !== "s-loading" && prop.name !== "s-html";
  });
  props.forEach((prop, index) => {
    if (prop.name !== "s-if" && prop.name !== "s-for" && prop.name !== "on" && prop.name !== "bind" && prop.name !== "slot" && prop.name !== "s-html") {
      str += `"${prop.name}":"${prop.value.content}"`;
    } else if (prop.name === "bind") {
      str += `"${prop.arg.content}":${prop.exp.content}`;
    } else if (prop.name === "slot") {
      str += `"slot":"${prop.arg.content}"`;
    }
    if (prop.name !== "s-if" && prop.name !== "s-for" && prop.name !== "on" && index < props.length - 1) {
      str += ",";
    }
  });
  return str;
}
function dealEvent(props) {
  let str = "";
  props = props.filter((prop) => {
    return prop.name === "on";
  });
  props.forEach((prop, index) => {
    if (prop.name === "on") {
      let funString = `${prop.exp.content}`;
      if (prop.exp.isStatic) {
        funString = `(e)=>{${prop.exp.content}}`;
      }
      str += `"${prop.arg.content}":{"value":${funString},"isStatic":${prop.exp.isStatic}${prop.exp.parameters ? `,"parameters":[${prop.exp.parameters}]` : ""},"modifiers":[${Array2String(prop.modifiers)}]}`;
      if (prop.name === "on" && index < props.length - 1) {
        str += ",";
      }
    }
  });
  return str;
}
function Array2String(arr) {
  if (!isArray2(arr)) {
    return "";
  }
  return arr.map((a) => {
    return `"${a}"`;
  });
}

// packages/sugar-compiler/src/transform/sFor.ts
function sFor(context, prop) {
  const forMatch = prop.value.content.split(" in ");
  const reg = /(?<=\()(.+?)(?=\))/;
  forMatch[0] = forMatch[0].match(reg) ? forMatch[0].match(reg)[0].split(",") : forMatch[0];
  context.forStatment = {
    exp: forMatch[1],
    item: isArray2(forMatch[0]) ? forMatch[0][0] : forMatch[0],
    index: isArray2(forMatch[0]) ? forMatch[0][1] : null
  };
}

// packages/sugar-compiler/src/transform/sHtml.ts
function sHtml(context, prop) {
  context.htmlStatment = {
    value: prop.value
  };
}

// packages/sugar-compiler/src/transform/sLoading.ts
function sLoading(context, prop) {
  context.loading = {
    value: prop.value.content,
    type: prop.value.type
  };
}

// packages/sugar-compiler/src/transform/transformEvent.ts
function transformEvent(content, prop) {
  if (prop.exp.content.includes("(") && prop.exp.content.includes(")")) {
    const eventStr = prop.exp.content;
    prop.exp.content = prop.exp.content.substring(0, eventStr.indexOf("("));
    prop.exp.parameters = eventStr.substring(eventStr.indexOf("(") + 1, eventStr.length - 1).split(",");
  }
}

// packages/sugar-compiler/src/transform/sModel.ts
function sModel(context, prop) {
  context.props.push({
    type: 7,
    name: "on",
    exp: {
      type: 4,
      content: `_ctx_.${prop.value.content} = e.target.value`,
      isStatic: true
    },
    arg: {
      type: 4,
      content: "input"
    },
    modifiers: []
  });
  context.props.push({
    type: 7,
    name: "bind",
    exp: {
      type: 4,
      content: `_ctx_.${prop.value.content}`
    },
    arg: {
      type: 4,
      content: "value"
    },
    modifiers: []
  });
}

// packages/sugar-compiler/src/compile.ts
function baseCompile(template) {
  const ast = toAst(template);
  transform(ast, {
    sIf,
    sFor,
    sHtml,
    sLoading,
    transformEvent,
    sModel
  });
  return {
    root: ast,
    code: generate(ast)
  };
}

// packages/sugar-compiler/src/index.ts
function sugarCompiler(template) {
  function compile(template2 = "") {
    const { code, root } = baseCompile(template2);
    return {
      code: createFunction(code),
      root
    };
  }
  function createFunction(code = "") {
    return new Function(`    const _ctx_ = this;
    const proxy = new Proxy({}, {
      get(target, prop, receiver) {
        if (prop in ctx) {
          return ctx[prop];
        }
        throw new ReferenceError(\`Missing variable \${String(prop)} in template\`);
      }
    });
    return ${code.toString()};
  `);
  }
  return compile(template);
}

// compiler.plugin.ts
var sugarCompilePlugin = () => {
  return {
    name: "sugar-compile",
    transform(code, id) {
      if (!id.endsWith(".ts")) return null;
      let result = "";
      let lastIndex = 0;
      const renderPattern = /render:\s*([`'"])/g;
      let match;
      while ((match = renderPattern.exec(code)) !== null) {
        const quote = match[1];
        const quoteStart = renderPattern.lastIndex;
        const start = match.index;
        let i = quoteStart;
        let escaped = false;
        let templateEnd = -1;
        while (i < code.length) {
          const char = code[i];
          if (!escaped && char === quote) {
            templateEnd = i;
            break;
          }
          escaped = !escaped && char === "\\";
          if (char !== "\\") escaped = false;
          i++;
        }
        if (templateEnd === -1) {
          continue;
        }
        const templateContent = code.slice(quoteStart, templateEnd);
        let compiledCode = "() => null";
        let headTag = "div";
        try {
          const compiled = sugarCompiler(templateContent);
          compiledCode = compiled.code;
          headTag = compiled.root?.tag ?? "div";
        } catch (e) {
          console.warn("[sugar-compile] Error compiling template:", id);
          console.warn("[sugar-compile] Failed to compile template:", e);
        }
        result += code.slice(lastIndex, start);
        result += `render: ${compiledCode},
headTag: '${headTag}'`;
        lastIndex = templateEnd + 1;
        renderPattern.lastIndex = templateEnd + 1;
      }
      result += code.slice(lastIndex);
      return {
        code: result,
        map: null
      };
    }
  };
};
var compiler_plugin_default = sugarCompilePlugin;
export {
  compiler_plugin_default as default
};
