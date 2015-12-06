const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    devtool: 'eval',
    entry: [
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8080',
        path.resolve(__dirname, 'app', 'app.jsx'),
    ],
    output: {
        path: path.resolve(__dirname, 'app', 'build'),
        filename: 'bundle.js',
        publicPath: '/build'
    },
    module: {
        preLoaders: [

        ],
        loaders: [
            {
                test: /\.html$/,
                loader: 'raw',
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!autoprefixer-loader?browsers=last 2 versions!sass?sourceMap'),
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&minetype=application/font-woff',
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
            },
            {test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),

        // styles from initial chunks into separate css output file
        new ExtractTextPlugin('bundle.css'),
    ],
};

module.exports = config;
