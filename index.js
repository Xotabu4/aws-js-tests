"use strict"
// This handler will be run as AWS lambda function entry point
exports.handler = function (event, context, callback) {
    var testName = event.queryStringParameters['testName']
    // Unfortunatelly protractor programmatic usage is really limited. Doing dirty hacks
    global.AWS_LAMBDA_EVENT = event;
    global.AWS_LAMBDA_CONTEXT = context;
    process.exit = function () {
        console.log('exiting!')
        // var response = {
        //     "statusCode": 200,
        //     "body": global.RESULTS,
        //     "isBase64Encoded": false
        // };
        callback(null, JSON.stringify(global.RESULTS));
    }
    let additionalConfig = {
        mochaOpts: {
            grep: testName,
            timeout: 60000,
        },

        resultJsonOutputFile: './outPut.json'
    }
    startProtractor(additionalConfig);
};

function startProtractor(addtionalConfig) {
    // I will burn in hell for this
    require('fs').writeFileSync = function (filepath, json) {
        global.RESULTS = JSON.stringify(json)
    }
    //fs.writeFileSync(filepath, json);
    const Launcher = require("protractor/built/launcher");
    Launcher.init('./protractor.conf.js', addtionalConfig);
}