const path = require('path');
const {VueLoaderPlugin} = require('vue-loader')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {
    ElementPlusResolver
} = require('unplugin-vue-components/resolvers')

module.exports = {
    entry: './vue/main.js',
    node: false,
    devtool: "source-map",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist/scripts/vue'),
    },
    mode: "development",
    module: {
        rules: [{
            test: /.vue$/,
            use: [{loader: "vue-loader"}],
        }, {
            test: /\.css$/,
            use: [
                {loader: 'style-loader'},
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                    },
                },
                {loader: 'sass-loader'},
            ],
        }]
    },
    plugins: [
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
                to: path.join(__dirname, 'dist/scripts')
            },{
                from: path.join(__dirname, 'utils'),
                to: path.join(__dirname, 'dist/utils')
            },{
                from: path.join(__dirname, 'html'),
                to: path.join(__dirname, 'dist/html')
            },{
                from: path.join(__dirname, 'css'),
                to: path.join(__dirname, 'dist/css')
            },{
                from: path.join(__dirname, 'assets'),
                to: path.join(__dirname, 'dist/assets')
            },{
                from: path.join(__dirname, 'index.js'),
                to: path.join(__dirname, 'dist')
            },{
                from: path.join(__dirname, 'manifest.json'),
                to: path.join(__dirname, 'dist')
            }]
        })
    ].filter(Boolean)
};