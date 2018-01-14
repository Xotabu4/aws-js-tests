console.time('total')
var Mocha = require('mocha')
var fs = require('fs')
var path = require('path')



var mocha = new Mocha();

//mocha.ui('aws-ui');

var testDir = './test/'
// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function (file) {
    // Only keep the .js files
    return file.substr(-3) === '.js';
}).forEach(function (file) {
    mocha.addFile(
        path.join(testDir, file)
    )
})


mocha.run(function (failures) {
    process.on('exit', function () {
        console.timeEnd('total')
        process.exit(failures);  // exit with non-zero status if there were failures
    })
})