import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import config from 'config';

const graphQLURI = config.get('graphql.uri');

let devtool = false,
    plugins = [];

if (process.env.NODE_ENV === 'production') {
    plugins = [
        new UglifyJsPlugin({
            uglifyOptions: {
                mangle: false
            }
        })
    ];
} else {
    // Enable source maps only for non production environments
    devtool = 'cheap-eval-source-map';
}

const webpackConfig = {
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint

        'webpack/hot/only-dev-server',

        'react-hot-loader/patch',
        // activate HMR for React

        './src/index'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.min\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
                ],
                exclude: /\.min\.css/
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.js$/,
                use: { loader: 'babel-loader' },
                exclude: /node_modules/
            },
            {
                test: /\.(jpg|png|svg)$/,
                loader: 'url-loader',
                options: { limit: 25000 }
            },
            {
                test: /\.csv$/,
                loader: 'dsv-loader'
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/fonts/'
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // enable HMR globally

        new webpack.NamedModulesPlugin(),
        // prints more readable module names in the browser console on HMR updates

        new webpack.NoEmitOnErrorsPlugin(),
        // do not emit compiled assets that include errors

        new CopyWebpackPlugin([{
            context: 'src/assets',
            from: '**/*'
        },
        {
            context: 'node_modules/@salesforce-ux/design-system/assets',
            from: '**/*',
            to: 'css/sfdc/'
        }]),

        new webpack.DefinePlugin({
            'URI_GRAPHQL': JSON.stringify(graphQLURI)
        }),

        ...plugins
    ],
    devtool,
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        open: true,

        historyApiFallback: true,
        // respond to 404s with index.html

        hot: true,
        // enable HMR on the server

        proxy: {
            '*': 'http://localhost:3001'
        }
        // Proxy to route API queries to express server
    }
};

module.exports = webpackConfig;
