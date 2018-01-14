// let run = require('./dist/aws_run.js').run

// run('Suite #1 Test #1')

console.time('total')
var Mocha = require('mocha')
var fs = require('fs')
var path = require('path')
var request = require('request-promise-native')

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

mocha.loadFiles()

let testResps = []
for (let suite of mocha.suite.suites) {
    for (let test of suite.tests) {
        let testName = suite.title + ' ' + test.title
        
        testResps.push(request({
            url: 'https://jbmu0byt9f.execute-api.us-west-2.amazonaws.com/prod',
            qs: {
                "testName": testName
            }
        }))

        console.log(testName, ' Pushed!')
        // mocha.run(function (failures) {
        //     process.on('exit', function () {
        //         console.timeEnd('total')
        //         process.exit(failures);  // exit with non-zero status if there were failures
        //     })
        // })
    }
}

Promise.all(testResps).then(function (results) {
    console.dir(results)
    console.timeEnd('total')
}, function (errors) {
    console.log(JSON.stringify(errors))
})
