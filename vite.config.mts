import {defineConfig} from 'vite';
import path from 'path';

export default defineConfig({
    server: {
        open: true,          // 启动时自动打开浏览器
        port: 9999,          // 默认端口是 3000，你可以更改为其他端口
        strictPort: true     // 如果端口已经被占用，Vite 会退出并显示错误
    },
    resolve: {
        alias: {
            '@sugar/sugar-core': path.resolve(__dirname, 'packages/sugar-core/src'),  // 这里修正路径
            '@sugar/sugar-ui': path.resolve(__dirname, 'packages/sugar-ui/src'),
            '@sugar/sugar-reactive': path.resolve(__dirname, 'packages/sugar-reactive/src'),
            '@sugar/sugar-render': path.resolve(__dirname, 'packages/sugar-render/src'),
            '@sugar/sugar-shared': path.resolve(__dirname, 'packages/sugar-shared/src'),
            '@sugar/sugar-hook': path.resolve(__dirname, 'packages/sugar-hook/src'),
            '@sugar/sugar-compiler': path.resolve(__dirname, 'packages/sugar-compiler/src'),
            '@sugar': path.resolve(__dirname, 'packages/sugar/src')
        },
    },
    build: {
        sourcemap: true,
        lib: {
            entry: 'packages/sugar/src/main.ts',  // 入口文件
            name: 'Sugar',     // 库的全局变量名
            fileName: (format) => `sugar.${format}.js`,  // 输出文件名
            formats: ['es', 'umd', 'cjs'] // 加上 'cjs'
        },
        rollupOptions: {
            external: [],  // 如果有外部依赖，可以在此处指定
            output: {
                globals: {
                    // 如果你的库依赖外部库（如 vue、react 等），可以在这里配置
                },
            },
        },
    },
});
