process.env.NODE_ENV = 'production';

process.env.UV_THREADPOOL_SIZE = 100;
const webpack = require('webpack');

const config = require('./../config/index');

const path = require('path');

const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const embedFileSize = 65536;
const assetsLoaders = [
    // Styles
    // -------------------
    {test: /\.(scss|css)$/, loader: ExtractTextPlugin.extract([ 'css', 'postcss', 'sass'])},

    // Media Resources
    // -------------------
    {test: /\.mp4$/, loader: `url?limit=${embedFileSize}&mimetype=video/mp4`},
    {test: /\.svg$/, loader: `url?limit=${embedFileSize}&mimetype=image/svg+xml`},
    {test: /\.png$/, loader: `url?limit=${embedFileSize}&mimetype=image/png`},
    {test: /\.jpg$/, loader: `url?limit=${embedFileSize}&mimetype=image/jpeg`},
    {test: /\.gif$/, loader: `url?limit=${embedFileSize}&mimetype=image/gif`},
    {
        test: /\.(otf|eot|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: `url?limit=${embedFileSize}`
    }
];


module.exports = {
    context: __dirname,
    entry: [
        path.join('..', 'frontend','index.js')
    ],
    output: {
        publicPath: '/public',
        path: path.resolve('public'),
        filename: 'script.js',
    },

    plugins: [
        new ExtractTextPlugin("app.css"),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: assetsLoaders.concat([
            {test: /\.js$/, loaders: ['babel-loader'], exclude: /(node_modules|bower_components|libraries)/}
        ])
    },
    resolve: {
        root: path.resolve(__dirname),
        extensions: ['', '.js','.scss','.css']
    },
    postcss: function () {
        return [
            autoprefixer({ browsers: ['last 2 versions'] })

        ];
    }
};
