const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {DefinePlugin}=require('webpack');
module.exports = (_environment, options = {}) => ({
    mode: 'production',
    entry: './src/app/index.jsx',
    resolve: {extensions: ['.js', '.jsx', '.cjs']},
    // Nome estável no desenvolvimento evita HTML antigo apontando a um hash
    // removido durante recompilações. Produção mantém cache por conteúdo.
    output: {path: path.resolve(__dirname, 'dist'), filename: options.mode==='development'?'circuit.js':'circuit.[contenthash:8].js', clean: true},
    module: {rules: [
        {test: /\.(jpg|png|webp)$/, type: 'asset/resource'},
        {test: /\.jsx?$/, exclude: /node_modules/, use: {loader: 'babel-loader', options: {presets: ['@babel/preset-env', '@babel/preset-react']}}},
        {test: /\.css$/, use: ['style-loader', 'css-loader']}
    ]},
    plugins: [new HtmlWebpackPlugin({template: './src/app/index.html', favicon: './src/shared/assets/favicon.svg'}),new DefinePlugin({'process.env.FIREBASE_EMULATORS':JSON.stringify(process.env.FIREBASE_EMULATORS||'false')})],
    devServer: {port: process.env.PORT||8610, host: '127.0.0.1',proxy:[{context:['/api'],target:'http://127.0.0.1:8611'}]}
});
