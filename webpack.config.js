const path = require('path');
const {VueLoaderPlugin} = require('vue-loader')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const distDir = process.env.DIR
const {
    ElementPlusResolver
} = require('unplugin-vue-components/resolvers')
const {DefinePlugin} = require("webpack");


const version = "v7.3.6";

module.exports = {
    entry: './vue/main.js',
    node: false,
    devtool: "source-map",
    output: {
        filename: 'vMin.js',
        path: path.resolve(__dirname, distDir + '/scripts/vue'),
        clean: true
    },
    module: {
        rules: [{
            test: /.vue$/,
            use: [
                {loader: "vue-loader"}
            ],
        }, {
            test: /\.css$/,
            use: [
                {loader: 'style-loader'},
                {loader: 'css-loader'}
            ],
        }, {
            test: /\.s[ca]ss$/,
            use: [
                {loader: 'style-loader'},
                {loader: 'css-loader'},
                {loader: 'sass-loader'},
            ],
        }, {
            test: /(\.jsx|\.js)$/,
            use: ['babel-loader'],
            exclude: /node_modules/
        }]
    },
    plugins: [
        new DefinePlugin({
            'process.env.DIR': `"${distDir}"`,
        }),
        new CleanWebpackPlugin(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        new VueLoaderPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.join(__dirname, 'scripts'),
                to: path.join(__dirname, distDir + '/scripts')
            }, {
                from: path.join(__dirname, 'json'),
                to: path.join(__dirname, distDir + '/json')
            }, {
                from: path.join(__dirname, 'utils'),
                to: path.join(__dirname, distDir + '/utils')
            }, {
                from: path.join(__dirname, 'html'),
                to: path.join(__dirname, distDir + '/html')
            }, {
                from: path.join(__dirname, 'css'),
                to: path.join(__dirname, distDir + '/css')
            }, {
                from: path.join(__dirname, 'assets'),
                to: path.join(__dirname, distDir + '/assets')
            }, {
                from: path.join(__dirname, 'manifest.json'),
                to: path.join(__dirname, distDir)
            }, {
                from: path.join(__dirname, 'icon.png'),
                to: path.join(__dirname, distDir)
            }]
        })
    ].filter(Boolean)
};
