function run(grepString, callback) {

    var Mocha = require('mocha')
    var fs = require('fs')
    var path = require('path')
    var mocha = new Mocha();
    mocha.grep(grepString)
    var testDir = './test/'
    fs.readdirSync(testDir).filter(file => file.substr(-3) === '.js')
        .forEach(file => mocha.addFile(path.join(testDir, file)))

    mocha.run(callback) // accepts failures
}

module.exports.run = run;