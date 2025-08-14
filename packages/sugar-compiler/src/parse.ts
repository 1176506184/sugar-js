import { extend, isArray, isStaticExpression } from './utils';

const scopeStack: any[] = [];

function enterScope(newScope: any) {
  scopeStack.push(newScope);
}

function exitScope() {
  scopeStack.pop();
}

export function parse(context: any, ancestors: any) {
  const parent: any = last(ancestors);
  const nodes = [];
  while (!isEnd(context, ancestors)) {
    const s = context.source;
    let node: any;
    if (startsWith(s, context.options.delimiters[0])) {
      node = parseInterpolation(context);
    } else if (s[0] === '<') {
      if (s.length === 1) {
        // 什么都不做
      } else if (s[1] === '/') {
        if (s[2] === '>') {
          advanceBy(context, 3);
          continue;
        } else if (/[a-z]/i.test(s[2])) {
          parseTag(context, TagType.End, parent);
          continue;
        } else {
          node = parseComment(context);
        }
      } else if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors);
      } else if (s[1] === '!') {
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

  const shouldCondense = context.options.whitespace !== 'preserve';
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === NodeTypes.TEXT) {
      if (!context.inPre) {
        if (!/[^\t\r\n\f ]/.test(node.content)) {
          const prev = nodes[i - 1];
          const next = nodes[i + 1];
          if (
            !prev ||
            !next ||
            (shouldCondense &&
              ((prev.type === NodeTypes.COMMENT && next.type === NodeTypes.COMMENT) ||
                (prev.type === NodeTypes.COMMENT && next.type === NodeTypes.ELEMENT) ||
                (prev.type === NodeTypes.ELEMENT && next.type === NodeTypes.COMMENT) ||
                (prev.type === NodeTypes.ELEMENT &&
                  next.type === NodeTypes.ELEMENT &&
                  /[\r\n]/.test(node.content))))
          ) {
            removedWhitespace = true;
            nodes[i] = null as any;
          } else {
            // Otherwise, the whitespace is condensed into a single space
            node.content = ' ';
          }
        } else if (shouldCondense) {
          // in condense mode, consecutive whitespaces in text are condensed
          // down to a single space.
          node.content = node.content.replace(/[\t\r\n\f ]+/g, ' ');
        }
      } else {
        // #6410 normalize windows newlines in <pre>:
        // in the DOM
        node.content = node.content.replace(/\r\n/g, '\n');
      }
    } else if (node.type === NodeTypes.COMMENT && !context.options.comments) {
      removedWhitespace = true;
      nodes[i] = null as any;
    }
  }

  if (context.inPre && parent && context.options.isPreTag(parent.tag)) {
    // remove leading newline per html spec
    // https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element
    const first = nodes[0];
    if (first && first.type === NodeTypes.TEXT) {
      first.content = first.content.replace(/^\r?\n/, '');
    }
  }

  return removedWhitespace ? nodes.filter(Boolean) : nodes;
}

function parseAttributes(context: any, type: any) {
  const props = [];
  const attributeNames = new Set<string>();
  // ✅ 提前检查当前标签是否含有 s-for="(item,index) in xxx"
  const firstTagMatch = context.source
    .slice(0, context.source.indexOf('>'))
    .match(/s-for\s*=\s*["']\s*\(([^)]+)\)\s+in\s+[^"']+["']/);
  if (firstTagMatch) {
    const aliases = firstTagMatch[1].split(',').map((s) => s.trim());
    enterScope(aliases);
  } else if (type === 0) {
    enterScope([]);
  }

  while (
    context.source.length > 0 &&
    !startsWith(context.source, '>') &&
    !startsWith(context.source, '/>')
  ) {
    if (startsWith(context.source, '/')) {
      advanceBy(context, 1);
      advanceSpaces(context);
      continue;
    }

    const attr = parseAttribute(context, attributeNames);
    if (['s-if', 's-html'].includes(attr.name)) {
      attr.value.content = bindCtx(attr.value.content);
    }

    if (attr.name === 's-for') {
      const tar = attr.value.content.split(' in ');
      attr.value.content = tar[0] + ' in ' + bindCtx(tar[1]);
    }

    if (attr.type === NodeTypes.ATTRIBUTE && attr.value && attr.name === 'class') {
      attr.value.content = attr.value.content.replace(/\s+/g, ' ').trim();
    }

    if (type === TagType.Start) {
      props.push(attr);
    }
    advanceSpaces(context);
  }
  return props;
}

function parseAttribute(context: any, nameSet: any) {
  const start = getPos(context);
  const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)!;

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
    const match = /(?:^v-([a-z0-9-]+))?(?:(?::|^\.|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(name)!;
    const isPropShorthand = startsWith(name, '.');
    const dirName =
      match[1] ||
      (isPropShorthand || startsWith(name, ':')
        ? 'bind'
        : startsWith(name, '@') || startsWith(name, 's-on:')
          ? 'on'
          : 'slot');
    let arg: { type: NodeTypes; content: string; loc: { start: any; end: any; source: any } };
    if (match[2]) {
      const isSlot = dirName === 'slot';
      const startOffset = name.lastIndexOf(match[2], name.length - (match[3]?.length || 0));

      const loc = getSelection(
        context,
        getNewPosition(context, start, startOffset),
        getNewPosition(
          context,
          start,
          startOffset + match[2].length + ((isSlot && match[3]) || '').length,
        ),
      );

      let content = match[2];

      if (content.startsWith('[')) {
        if (!content.endsWith(']')) {
          content = content.slice(1);
        } else {
          content = content.slice(1, content.length - 1);
        }
      } else if (isSlot) {
        content += match[3] || '';
      }

      arg = {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content,
        loc,
      };
    }

    if (value?.isQuoted) {
      const valueLoc = value.loc;
      valueLoc.start.offset++;
      valueLoc.start.column++;
      valueLoc.end = advancePosWithClone(valueLoc.start, value.content);
      valueLoc.source = valueLoc.source.slice(1, -1);
    }

    const modifiers = match[3] ? match[3].slice(1).split('.') : [];
    if (isPropShorthand) modifiers.push('prop');

    return {
      type: NodeTypes.DIRECTIVE,
      name: dirName,
      exp: value && {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content: bindCtx(value.content),
        loc: value.loc,
        isStatic: !isStaticExpression(value.content),
      },
      arg,
      modifiers,
      loc,
    };
  }

  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value: value && {
      type: NodeTypes.TEXT,
      content: value.content,
      loc: value.loc,
    },
    loc,
  };
}

function getNewPosition(context: any, start: any, numberOfCharacters: number) {
  return advancePosWithClone(
    start,
    context.originalSource.slice(start.offset, numberOfCharacters),
    numberOfCharacters,
  );
}

function parseAttributeValue(context: any) {
  const start = getPos(context);
  let content: string;

  const quote = context.source[0];
  const isQuoted = quote === '"' || quote === "'";

  if (isQuoted) {
    // Quoted value.
    advanceBy(context, 1);

    const endIndex = context.source.indexOf(quote);
    if (endIndex === -1) {
      content = parseTextData(context, context.source.length);
    } else {
      content = parseTextData(context, endIndex);
      advanceBy(context, 1);
    }
  } else {
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
    loc: getSelection(context, start),
  };
}

function pushNode(nodes: any, node: any): void {
  if (node.type === NodeTypes.TEXT) {
    const prev: any = last(nodes);
    // Merge if both this and the previous node are text and those are
    // consecutive. This happens for cases like "a < b".
    if (prev && prev.type === NodeTypes.TEXT && prev.loc.end.offset === node.loc.start.offset) {
      prev.content += node.content;
      prev.loc.end = node.loc.end;
      prev.loc.source += node.loc.source;
      return;
    }
  }

  nodes.push(node);
}

function parseElement(context: any, ancestors: any) {
  const parent = last(ancestors);
  const element: any = parseTag(context, TagType.Start, parent);
  if (element.isSelfClosing || context.options.isVoidTag(element.tag)) {
    return element;
  }
  ancestors.push(element);
  const children = parse(context, ancestors);
  ancestors.pop();
  element.children = children;
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End, parent);
  }
  element.loc = getSelection(context, element.loc.start);
  return element;
}

function parseTag(context, type, parent) {
  const start = getPos(context);
  const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source)!;
  const tag = match[1];

  advanceBy(context, match[0].length);
  advanceSpaces(context);

  const props = parseAttributes(context, type);

  let isSelfClosing = false;

  if (context.source.length !== 0) {
    isSelfClosing = startsWith(context.source, '/>');
    advanceBy(context, isSelfClosing ? 2 : 1);
  }

  if (type === TagType.End) {
    exitScope();
    return;
  }

  const tagType = ElementTypes.ELEMENT;

  return {
    type: NodeTypes.ELEMENT,
    tag,
    tagType,
    children: [],
    props,
    isSelfClosing,
    loc: getSelection(context, start),
  };
}

const enum TagType {
  Start,
  End,
}

export const enum ElementTypes {
  ELEMENT,
}

export const enum Namespaces {
  HTML,
}

function parseComment(context: any) {
  const start = getPos(context);
  const contentStart = context.source[1] === '?' ? 1 : 2;
  let content: string;

  const closeIndex = context.source.indexOf('-->') + 2;
  if (closeIndex === -1) {
    content = context.source.slice(contentStart);
    advanceBy(context, context.source.length);
  } else {
    content = context.source.slice(contentStart, closeIndex);
    advanceBy(context, closeIndex + 1);
  }

  return {
    type: NodeTypes.COMMENT,
    content,
    loc: getSelection(context, start),
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
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: bindCtx(content),
      loc: getSelection(context, innerStart, innerEnd),
    },
    loc: getSelection(context, start),
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
    type: NodeTypes.TEXT,
    content,
    loc: getSelection(context, start),
  };
}

function parseTextData(context: any, length: any) {
  const rawText = context.source.slice(0, length);
  advanceBy(context, length);
  return rawText;
}

function getSelection(context: any, start: any, end?: any) {
  end = end || getPos(context);
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset),
  };
}

function matchText(context: any, length: any) {
  const rawText = context.source.slice(0, length);
  advanceBy(context, length);
  return rawText;
}

function advanceBy(context: any, numberOfCharacters: number): void {
  const { source } = context;
  advancePos(context, source, numberOfCharacters);
  context.source = source.slice(numberOfCharacters);
}

export function advancePos(pos, source, numberOfCharacters = source.length) {
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
    lastNewLinePos === -1 ? pos.column + numberOfCharacters : numberOfCharacters - lastNewLinePos;

  return pos;
}

function advancePosWithClone(pos: any, source: string, numberOfCharacters: number = source.length) {
  return advancePos(extend({}, pos), source, numberOfCharacters);
}

function advanceSpaces(context: any): void {
  const match = /^[\t\r\n\f ]+/.exec(context.source);
  if (match) {
    advanceBy(context, match[0].length);
  }
}

function startsWith(source: string, searchString: string): boolean {
  return source.startsWith(searchString);
}

function startsWithEndTagOpen(source: string, tag: string): boolean {
  return (
    startsWith(source, '</') &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase() &&
    /[\t\r\n\f />]/.test(source[2 + tag.length] || '>')
  );
}

function last<T>(xs: T[]): T | undefined {
  return xs[xs.length - 1];
}

function getPos(context) {
  const { column, line, offset } = context;
  return {
    column,
    line,
    offset,
  };
}

export const enum NodeTypes {
  ROOT,
  ELEMENT,
  TEXT,
  COMMENT,
  SIMPLE_EXPRESSION,
  INTERPOLATION,
  ATTRIBUTE,
  DIRECTIVE,
  COMPOUND_EXPRESSION,
  COMPONENT,
  SLOT,
}

// JavaScript 内置全局变量和关键字白名单
const jsGlobals = new Set([
  // 原始值
  'true',
  'false',
  'null',
  'undefined',
  'NaN',
  'Infinity',

  // 基本对象
  'Object',
  'Function',
  'Boolean',
  'Symbol',
  'Error',
  'EvalError',
  'InternalError',
  'RangeError',
  'ReferenceError',
  'SyntaxError',
  'TypeError',
  'URIError',

  // 数字与数学
  'Number',
  'BigInt',
  'Math',
  'Date',

  // 文本处理
  'String',
  'RegExp',

  // Indexed collections
  'Array',
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',

  // Keyed collections
  'Map',
  'Set',
  'WeakMap',
  'WeakSet',

  // Structured data
  'ArrayBuffer',
  'SharedArrayBuffer',
  'Atomics',
  'DataView',
  'JSON',

  // Control abstraction objects
  'Promise',
  'Generator',
  'GeneratorFunction',
  'AsyncFunction',

  // Reflection
  'Reflect',
  'Proxy',

  // Web APIs & runtime globals
  'window',
  'globalThis',
  'console',
  'alert',
  'setTimeout',
  'setInterval',
  'clearTimeout',
  'clearInterval',
  'requestAnimationFrame',
  'cancelAnimationFrame',

  // DOM
  'document',
  'location',
  'history',
  'navigator',

  // 新语言关键字等
  'await',
  'async',
  'arguments',
  'this',
]);

function bindCtx(code: string): string {
  return code.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, (match, varName, offset, fullText) => {
    // 1. 跳过字符串内的变量
    const before = fullText.slice(0, offset);
    const inSingleQuotes = /'[^']*$/.test(before) && /[^']*'/.test(fullText.slice(offset));
    const inDoubleQuotes = /"[^"]*$/.test(before) && /[^"]*"/.test(fullText.slice(offset));
    const inBacktick = /`[^`]*$/.test(before) && /[^`]*`/.test(fullText.slice(offset));
    if (inSingleQuotes || inDoubleQuotes || inBacktick) return match;

    // 2. 排除属性访问，例如 obj.key 中的 key
    const prevChar = fullText[offset - 1];
    if (prevChar === '.' || prevChar === ':') return match;

    // 3. 排除全局作用域变量、JS 内置变量
    if (hasScope(varName) || jsGlobals.has(varName)) return match;

    // 4. 默认加 _ctx_
    return `_ctx_.${varName}`;
  });
}

function flattenArray(arr: any[]): any[] {
  const result: any[] = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenArray(item));
    } else {
      result.push(item);
    }
  }

  return result;
}

function hasScope(name: string): boolean {
  return flattenArray(scopeStack).includes(name);
}
