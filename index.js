"use strict"
// This handler will be run as AWS lambda function
exports.handler = (event, context, callback) => {
    var testName = event.queryStringParameters['testName']
    var run = require('./aws_run.js').run
    run(testName, function (failures) {
        var response = {
            "statusCode": 200,
            "headers": {
                "my_header": "my_value"
            },
            "body": JSON.stringify({ 'Test Name': testName, 'isFailed': failures > 0 ? true : false, "queryParams": event.queryStringParameters }),
            "isBase64Encoded": false
        };
        callback(null, response);
    })
};
