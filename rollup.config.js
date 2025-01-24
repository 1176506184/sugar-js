import replace from 'rollup-plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import babel from 'rollup-plugin-babel';

const isDev = process.env.NODE_ENV !== 'production';

export default [{
  input: './packages/sugar/src/main.ts',
  output: [{
    file: isDev ? 'dist/sugar.js' : 'dist/sugar.js',
    name: 'Sugar',
    format: 'umd',
    sourceMap: true
  }, {
    file: isDev ? 'dist/sugar.bundle.js' : 'dist/sugar.bundle.js',
    name: 'Sugar',
    format: 'es',
    sourceMap: true
  }, {
    file: isDev ? 'dist/sugar.cjs' : 'dist/sugar.cjs',
    name: 'Sugar',
    format: 'cjs',
    sourceMap: true
  }],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    typescript(),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    isDev ? uglify() : null,
    // 热更新 默认监听根文件夹
    isDev ? livereload() : null,
    isDev ? serve({
      open: true, // 自动打开页面
      port: 8000,
      openPage: '/index.html', // 打开的页面
      contentBase: ''
    }) : null
  ]
}];
