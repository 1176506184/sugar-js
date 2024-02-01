import { baseCompile } from './compile';

export function sugarCompiler (template, data) {
  function compile (template = '') {
    const { code, root } = baseCompile(template, data);
    return {
      code: createFunction(code),
      root
    };
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
