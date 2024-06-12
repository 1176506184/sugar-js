import { NO } from './utils';
import { generate } from './codegen';
import { transform } from './transform';
import { sIf } from './transform/sIf';
import { sFor } from './transform/sFor';
import { sModel } from './transform/sModel';
import { sHtml } from './transform/sHtml';
import { transformEvent } from './transform/transformEvent';
import { transformRef } from './transform/transformRef';
import { Namespaces, parse } from './parse';

export function baseCompile (template: string, data = {}) {
  const ast = toAst(template);
  const keys = Object.keys(data).filter((key) => {
    return data[key]?.sugarReactiveDataType === 'Ref';
  });
  transform(ast, {
    sIf,
    sFor,
    sModel,
    sHtml,
    transformEvent,
    transformRef,
    appendRef: (context) => {
      for (let i = 0; i < keys.length; i++) {
        context = appendValueIfMatch(context, keys[i]);
      }
      return context;
    }
  });

  return {
    root: ast,
    code: generate(ast)
  };
}

function appendValueIfMatch (str, target) {
  // 构造一个用于查找目标子字符串，并且其后面紧跟特定字符的正则表达式
  const regex = new RegExp(`(?<![\"'])\\b${target}\\b(?!['\"])(?![\"'])`, 'gs');

  // 使用replace方法在满足条件的位置插入".value"
  return str.replace(regex, `${target}.value`);
}

function toAst (template: string) {
  const context = createBaseContent(template);
  return parse(context, [])[0];
}

function createBaseContent (content) {
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
      getNamespace: (tag: string, parent: any) => Namespaces.HTML
    }
  };
}
