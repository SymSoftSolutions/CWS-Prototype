process.env.NODE_ENV = 'development';


const webpack = require('webpack');

const config = require('./../config/index');

const path = require('path');

const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const embedFileSize = 65536;
const assetsLoaders = [
    // Styles
    // -------------------
    {test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass']},
    {
        test: /\.css$/,
        loader: 'style!css!postcss'
    },
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
    devtool: 'source-map',

    entry: [
        // Add the client which connects to our middleware
        // You can use full urls like 'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr'
        // useful if you run your app from another point like django
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client?reload=true',
         path.join('..', 'frontend','index.js')
    ],
    watch: true,
    output: {
        publicPath: '/public',
        path: __dirname,
        filename: 'script.js',
    },

    plugins: [
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
        new webpack.HotModuleReplacementPlugin(),
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
