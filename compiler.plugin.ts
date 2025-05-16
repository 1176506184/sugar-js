import { sugarCompiler } from '@sugar/sugar-compiler';

const sugarCompilePlugin = () => {
  return {
    name: 'sugar-compile',
    transform (code, id) {
      if (!id.endsWith('.ts')) return null; // 只处理 .ts 文件

      // 正则匹配 render 字段中的模板字符串
      const renderRegex = /render:\s*`([\s\S]*?)`/g;
      const transformedCode = code.replace(renderRegex, (match, templateContent) => {
        // 使用 sugar-compiler 编译模板并返回渲染函数
        const { code, root } = sugarCompiler(templateContent);
        return `render: ${code},
                headTag: '${root.tag}'`;
      });

      return {
        code: transformedCode,
        map: null // 如果需要 sourceMap，可以生成对应的映射
      };
    }
  };
};

export default sugarCompilePlugin;
