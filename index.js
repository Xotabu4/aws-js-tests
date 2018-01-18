"use strict"
// This handler will be run as AWS lambda function
exports.handler = function (event, context, callback) {
    var testName = event.queryStringParameters['testName']
    // Unfortunatelly protractor programmatic usage is really limited
    global.AWS_LAMBDA_EVENT = event
    global.AWS_LAMBDA_CONTEXT = context
    global.AWS_LAMBDA_CALLBACK = function () {
        var response = {
            "statusCode": 200,
            "body": JSON.stringify({ 'Test Name': testName, "queryParams": event.queryStringParameters }),
            "isBase64Encoded": false
        };
        callback(null, response);
    }
    let additionalConfig = { mochaOpts: { grep: testName } }
    startProtractor(additionalConfig);
};

function startProtractor(addtionalConfig) {
    const Launcher = require("protractor/built/launcher");
    Launcher.init('./protractor.conf.js', addtionalConfig);
}