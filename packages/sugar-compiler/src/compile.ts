import { toAst } from './toAst';
import { generate } from './codegen';
import { transform } from './transform';
import { sIf } from './transform/sIf';
import { sFor } from './transform/sFor';
import { sHtml } from './transform/sHtml';
import { sLoading } from './transform/sLoading';
import { transformEvent } from './transform/transformEvent';

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
