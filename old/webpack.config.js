const path = require('path');

module.exports = {

    entry: {
        a: ['./aws_run.js', "./test/test0.js", "./test/test1.js"]
      },
    output: {
        libraryTarget: "commonjs",
        filename: 'aws_run.js',
        path: path.resolve(__dirname, 'dist')
    },

    // node: {
    //     fs: 'empty'
    // },
    target: "node"
};