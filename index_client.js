console.time('total')
var Mocha = require('mocha')
var fs = require('fs')
var path = require('path')
var request = require('request-promise-native')

var mocha = new Mocha();
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

/**
 * Files are loaded but we do not run them here. 
 * Instead we iterate thru all parsed tests, grab their names
 * and push test name as a parameter to same code deployed to AWS lambda
 * this parameter will be used as mocha GREP parameter to run only 1 test for each lambda instance.
 * 
 */
let testResps = []
for (let suite of mocha.suite.suites) {
    for (let test of suite.tests) {
        // to grep by full describe + it name
        let testName = suite.title + ' ' + test.title

        testResps.push(request({
            url: 'https://jbmu0byt9f.execute-api.us-west-2.amazonaws.com/prod',
            qs: {
                "testName": testName
            }
        }).catch(err => err))
        console.log(testName, ' is pushed to AWS lambda!')
    }
}

Promise.all(testResps).then(function (results) {
    for (let result of results) {
        console.log('##', result)
        console.log('##########################')
    }
    console.timeEnd('total')
}, function (errors) {
    console.log('Oh no, got errors!')
    console.log(JSON.stringify(errors))
    console.timeEnd('total')
})
