const path = require("path");

module.exports = {
    mode: 'development',
    // entry: ['webpack-hot-middleware/client?reload=true', path.join(process.cwd(),'/index.js')],
    entry: {index:'./index.js'},
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean:true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    target: 'node'
};