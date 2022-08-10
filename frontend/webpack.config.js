// Generated using webpack-cli https://github.com/webpack/webpack-cli

const fs = require('fs');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    devServer: {
        client: {
            overlay: true,
            logging: 'error',
        },
        open: true,
        hot: true,
        static: './src/assets',
        host: 'localhost',
        historyApiFallback: true,
        onBeforeSetupMiddleware: function (devServer) {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            // /api/users 로 요청시 응답할 수 있는 라우터를 아래처럼 세팅할 수 있습니다.
            devServer.app.get('/api/v1/image', (req, res) => {
                fs.readdir('./src/assets/images/test_asset/', (err, files) => {
                    if (err) throw err;

                    let resultList = [];

                    while (resultList.length < +req.query.size) {
                        resultList.push({
                            id: resultList.length,
                            imageUrl: files.at(Math.random() * (files.length - 1) + 1),
                        });
                    }

                    res.json(resultList);
                });
            });
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/app.html',
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
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
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
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
