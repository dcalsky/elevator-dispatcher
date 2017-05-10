var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: [
        path.join(__dirname, 'src/index.ts'),
        path.join(__dirname, 'src/index.html')
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        libraryTarget: 'umd',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
            { test: /\.html$/, loader: "raw-loader" }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html'
        }),
         new webpack.optimize.UglifyJsPlugin({
             compress: {
                 warnings: false
             }
        }),
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'src/static'),
            to: 'static'
        }])
    ]
}
