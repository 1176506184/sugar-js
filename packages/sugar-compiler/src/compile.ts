import { NO } from './utils';
import { generate } from './codegen';
import { transform } from './transform';
import { sIf } from './transform/sIf';
import { sFor } from './transform/sFor';
import { sHtml } from './transform/sHtml';
import { sLoading } from './transform/sLoading';
import { transformEvent } from './transform/transformEvent';
import { Namespaces, parse } from './parse';

export function baseCompile (template: string) {
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
