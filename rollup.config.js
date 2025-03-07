import replace from 'rollup-plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';

const isDev = process.env.NODE_ENV !== 'production';
const isUi = process.env.NODE_ENV === 'ui';
const rollupConfig = isUi ? {
  input: './packages/sugar-ui/main.ts',
  output: [{
    file: 'dist/sugar-ui.js',
    name: 'Sugar',
    format: 'umd',
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
    uglify(),
    copy({
      targets: [
        { src: './packages/sugar-ui/css/sugar.css', dest: 'dist' } // 复制 src/assets 文件夹到 dist/assets 文件夹
      ]
    })
  ]
} : {
  input: './packages/sugar/src/main.ts',
  output: [{
    file: 'dist/sugar.js',
    name: 'Sugar',
    format: 'umd',
    sourceMap: true
  }, {
    file: 'dist/sugar.bundle.js',
    name: 'Sugar',
    format: 'es',
    sourceMap: true
  }, {
    file: 'dist/sugar.cjs',
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
    !isDev ? uglify() : null,
    // 热更新 默认监听根文件夹
    isDev ? livereload() : null,
    // 本地服务器
    // eslint-disable-next-line multiline-ternary
    isDev ? serve({
      open: true, // 自动打开页面
      port: 8000,
      openPage: '/index.html', // 打开的页面
      contentBase: ''
    }) : null
  ]
};

export default rollupConfig;
