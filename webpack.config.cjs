const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: './src/app/index.jsx',
    resolve: {extensions: ['.js', '.jsx', '.cjs']},
    output: {path: path.resolve(__dirname, 'dist'), filename: 'circuit.[contenthash:8].js', clean: true},
    module: {rules: [
        {test: /\.(jpg|png|webp)$/, type: 'asset/resource'},
        {test: /\.jsx?$/, exclude: /node_modules/, use: {loader: 'babel-loader', options: {presets: ['@babel/preset-env', '@babel/preset-react']}}},
        {test: /\.css$/, use: ['style-loader', 'css-loader']}
    ]},
    plugins: [new HtmlWebpackPlugin({template: './src/app/index.html', favicon: './src/shared/assets/favicon.svg'})],
    devServer: {port: 8610, host: '127.0.0.1'}
};
