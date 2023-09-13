import { baseCompile } from './compile';

export function sugarCompiler (template, components?: any, vm?: any) {
  function compile (template = '') {
    const astEX = baseCompile(template, components, vm);
    return createFunction(astEX);
  }

  function createFunction (code = '') {
    return new Function(`
            with(this) {
              return ${code};
            }
        `);
  }

  return compile(template);
}
