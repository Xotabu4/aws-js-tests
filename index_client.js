console.time('STARTED')
console.time('total')
var Mocha = require('mocha')
var fs = require('fs')
var path = require('path')
var request = require('request-promise-native')


var AWS = require('aws-sdk');
//var sqs = new AWS.SQS({region: AWS_REGION});
AWS.config.loadFromPath(__dirname + '/aws.config.json');
var lambda = new AWS.Lambda();


function updateAWScodeAndRun() {
    //dynamically create test files and tests
    generateTests()

    var zipdir = require('zip-dir');
    let outputFile = '../aws-js-tests.zip'
    console.log('Starting compressing...', outputFile)
    zipdir('/Users/olekh/github/aws-js-tests/', {
        //saveTo: outputFile, 
        filter: function (fullPath, stats) {
            let toIgnore = [
                '/.git',
                'aws.config.json',
                'index_client.js'
            ]
            for (let ignore of toIgnore) {
                return fullPath.includes(ignore) ? false : true
            }
        }
    }, function (err, buffer) {
        if (err) {
            console.log('File not created! something went wrong')
            throw err
        }
        console.log('Finished! Created: ', outputFile)
        if (buffer) {
            console.log('Updating aws lambda code...')
            lambda.updateFunctionCode({
                FunctionName: 'test',
                Publish: true,
                ZipFile: buffer
            }, function (err, data) {
                console.log(err)
                console.log('Updated!', data)
                console.log('Starting tests locally...')
                parseAndPushTests()
            })
        }
    });
}

/**
 * Just invoke lambda programmatically. sweeet
 * @param {*} testName 
 */
function invokeLambda(testName) {
    let payload = {
        queryStringParameters: {
            testName: testName
        }
    }

    var params = {
        FunctionName: 'test',
        //InvocationType: 'Event',
        Payload: JSON.stringify(payload),
        LogType: 'Tail'
    };

    return new Promise(function (resolve, reject) {
        lambda.invoke(params, function (err, data) {
            if (err) {
                console.error(err, err.stack);
                reject(err)
            } else {
                resolve(data)
            }
        });
    })
}

function parseAndPushTests() {
    var mocha = new Mocha();
    var testDir = './tests/'

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
     */
    let testResps = []
    for (let suite of mocha.suite.suites) {
        for (let test of suite.tests) {
            // to grep by full describe + it name
            let testName = suite.title + ' ' + test.title
            testResps.push(invokeLambda(testName).then((result) => {
                let logAsString = new Buffer(result.LogResult, 'base64').toString()
                
                let allureXMLAsString = JSON.parse(result.Payload).allure_xml
                console.log('Allure XML results! ', allureXMLAsString)
                // Not safe! rewrite in case EMFILE errors!
                fs.appendFile(`./allure-results/${testName}-testsuite.xml`, allureXMLAsString, (err) => {
                    if(err) console.log(err)
                });
                console.log('##', logAsString)
                // Not safe! rewrite in case EMFILE errors!
                fs.appendFile('./invoked_lambdas.log', logAsString, (err) => {
                    if(err) console.log(err)
                });
                console.log('##########################')
            }, (err) => {
                console.log('Oh no, got errors!')
                console.log(JSON.stringify(err))
            }))
            console.log(testName, ' is pushed to AWS lambda!')
        }
    }

    /* 1: Calling gateway API
    
        testResps.push(request({
            url: 'https://jbmu0byt9f.execute-api.us-west-2.amazonaws.com/prod',
            qs: {
                "testName": testName
            }
        }).catch(err => err))
    */

    /* 2: Pushing as SQS message - not implemented on aws side, only sqs exists, no lambda triggers
        var params = {
        MessageBody: testName, // required
        QueueUrl: 'https://sqs.us-west-2.amazonaws.com/498564203157/TestRequestQueue', // required
        DelaySeconds: 0,
        // MessageAttributes: {
        //   '<String>': {
        //     DataType: 'STRING_VALUE', // required
        //     BinaryListValues: [
        //       new Buffer('...') || 'STRING_VALUE' //Strings will be Base-64 encoded on your behalf,
        //       //more items
        //     ],
        //     BinaryValue: new Buffer('...') || 'STRING_VALUE' // Strings will be Base-64 encoded on your behalf
        //     StringListValues: [
        //       'STRING_VALUE',
        //       // more items 
        //     ],
        //     StringValue: 'STRING_VALUE'
        //   },
        // },
                };
        sqs.sendMessage(params, function (err, data) {
            console.log(testName, ' is pushed to AWS lambda!')
            console.log('ERROR', err)
            console.log('DATA', data)
            })
        })
    */
    if (testResps.length < 1) {
        throw new Error('testResponses are 0. Means noting executed. Maybe no tests were found?')
    }
    Promise.all(testResps).then(function (results) {
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        console.timeEnd('total')
    }, function (errors) {
        console.error('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        console.log('Oh no, got ERRORS!')
        console.log(errors)
        console.timeEnd('total')
    })

}


function generateTests(test_files_number = 10) {
    console.log('Will be', test_files_number, 'files')
    // For testing purposes only
    // Automatically synchronically generating needed number of test files on config parsing
    // Be sure that selenoid browser limit is set correctly
    var fs = require('fs');

    let index = 0
    while (index < test_files_number) {
        let testFileTemplate =
            `
let TEST = require('../test').TEST
describe('SUITE ${index}', function () {
    // Just using TEST function in test.js as test
    it('TEST ' + ${index}, TEST)
})
`
        fs.writeFileSync(`./tests/test_${index}.js`, testFileTemplate, { flag: 'w+' })
        index += 1
    }
    console.log('Generated', test_files_number, 'test files!')
}

//updateAWScodeAndRun()

//parseAndPushTests()