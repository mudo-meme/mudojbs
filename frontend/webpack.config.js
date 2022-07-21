// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
    entry: './public/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'asset/[hash][ext][query]',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),

        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
                // use: [
                //     stylesHandler,
                //     {
                //         loader: 'css-loader',
                //         options: {
                //             modules: {
                //                 localIdentName: '[local]--[hash:base64:5]',
                //             },
                //         },
                //     },
                //     'postcss-loader',
                //     'sass-loader',
                // ],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
                // use: [
                //     stylesHandler,
                //     {
                //         loader: 'css-loader',
                //         options: {
                //             modules: {
                //                 localIdentName: '[local]--[hash:base64:5]',
                //             },
                //         },
                //     },
                //     'postcss-loader',
                // ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
