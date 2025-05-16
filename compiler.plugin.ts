import { sugarCompiler } from '@sugar/sugar-compiler';
const sugarCompilePlugin = () => {
  return {
    name: 'sugar-compile',
    transform(code, id) {
      if (!id.endsWith('.ts')) return null;

      let result = '';
      let lastIndex = 0;

      const renderPattern = /render:\s*([`'"])/g;
      let match;

      while ((match = renderPattern.exec(code)) !== null) {
        const quote = match[1];
        const quoteStart = renderPattern.lastIndex; // 当前位置：在引号之后
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

          escaped = !escaped && char === '\\';
          if (char !== '\\') escaped = false;

          i++;
        }

        if (templateEnd === -1) {
          continue; // 未找到闭合引号，跳过
        }

        const templateContent = code.slice(quoteStart, templateEnd);

        let compiledCode: any = '() => null';
        let headTag = 'div';

        try {
          const compiled = sugarCompiler(templateContent);
          compiledCode = compiled.code;
          headTag = compiled.root?.tag ?? 'div';
        } catch (e) {
          console.warn('[sugar-compile] Error compiling template:', id)
          console.warn('[sugar-compile] Failed to compile template:', e);
        }

        result += code.slice(lastIndex, start);
        result += `render: ${compiledCode},\nheadTag: '${headTag}'`;

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


export default sugarCompilePlugin;
