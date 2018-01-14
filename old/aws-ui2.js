var Mocha = require('mocha');
var Suite = require('mocha/lib/suite')
var Test = require('mocha/lib/test')
var escapeRe = require('escape-string-regexp');
var request = require('request-promise');

/**
 * This example is identical to the TDD interface, but with the addition of a
 * "comment" function:
 * https://github.com/mochajs/mocha/blob/master/lib/interfaces/tdd.js
 */
module.exports = Mocha.interfaces['aws-ui2'] = function (suite) {
    var suites = [suite];

    suite.on('pre-require', function (context, file, mocha) {
        var originalIT = context.it
        var common = require('mocha/lib/interfaces/common')(suites, context);

        /**
         * Use all existing hook logic common to UIs. Common logic can be found in
         * https://github.com/mochajs/mocha/blob/master/lib/interfaces/common.js
         */
        // Remaining logic is from the tdd interface, but is necessary for a
        // complete example
        // https://github.com/mochajs/mocha/blob/master/lib/interfaces/tdd.js


        /**
         * Default TDD test-case logic. Describes a specification or test-case
         * with the given `title` and callback `fn` acting as a thunk.
         */
        context.it = function (title, fn) {
            var suite, test;

            suite = suites[0];
            if (suite.pending) fn = null;

            
            const wrapper = async function () {
                await request({
                    method: 'POST',
                    url: 'https://wt-e748449ad68f68a75a4ce7763748f041-0.run.webtask.io/faas-test',
                    //url: 'https://webtask.it.auth0.com/',
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiJiY2NlMzUwMmIyYWU0NjdmOTNiZDRiM2Q4NDMyYWMzYyIsImlhdCI6MTUxNTg3NTY1OSwiY2EiOlsiOTAwNzMzNGRiMDhjNGQ2M2E0MTNjZGFmM2YzYjYxNGMiLCJkMjYyNzZlYWJkMmM0Yjk4YmExYzBmNTNjNDg0OThjMiJdLCJkZCI6MCwidGVuIjoiL153dC1jMjQ3M2E1ZjU2MTFmODgyY2UzOGE3YjI1ZjYzNzY5YS1bMC0xXSQvIn0.5yLEKySd53xckmRO9q2YmQTWVpeWv-5qiPUVSSKBNt4'
                    },
                    body: `
                        console.log('calling!')
                        try {
                            eval((${fn.toString()})())
                        } catch (error) {
                            cb(error)
                        } 
                        cb(null, 'PASS');
                    `
                })
            }

            test = new Test(title, wrapper);
            test.file = file;

            console.log('###', title, test)

            suite.addTest(test);

            return test;
        }
    })
}