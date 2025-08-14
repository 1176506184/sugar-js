import { Namespaces, parse } from './parse';
export const NO = (tag: string) => false;
export function toAst(template: string) {
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
      getNamespace: (tag: string, parent: any) => Namespaces.HTML,
    },
  };
}
