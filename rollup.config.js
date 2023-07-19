import replace from "rollup-plugin-replace";
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from "rollup-plugin-typescript2";
import {terser} from "rollup-plugin-terser";
import {uglify} from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import babel from 'rollup-plugin-babel';

const isDev = process.env.NODE_ENV !== 'production';

export default {
    input: 'src/main.ts',
    output: {
        file: isDev ? 'dist/sugar.js' : 'dist/sugar.js',
        name: 'Sugar',
        format: 'umd',
        sourceMap: true
    },
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        commonjs({
            include: /node_modules/
        }),
        resolve(),
        terser({
            // compress: {
            //     drop_console: !isDev
            // },

        }),
        typescript(),
        replace({
            ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        isDev ? uglify() : null,
        // 热更新 默认监听根文件夹
        isDev ? livereload() : null,
        // 本地服务器
        isDev ? serve({
            open: true, // 自动打开页面
            port: 8000,
            openPage: '/index.html', // 打开的页面
            contentBase: ''
        }) : null
    ]
}
