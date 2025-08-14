import { baseCompile } from './compile';

export function sugarCompiler(template: string) {
  function compile(template = '') {
    const { code, root } = baseCompile(template);
    return {
      code: createFunction(code),
      root,
    };
  }

  function createFunction(code = '') {
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
