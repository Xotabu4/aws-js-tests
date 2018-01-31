console.time('protractorTime')
let conf = {
    seleniumAddress: process.env.SELENOID_URL || 'http://ip-5236.sunline.net.ua:4444/wd/hub',
    baseUrl: 'https://www.facebook.com/',
    specs: ['./tests/*.js'],
    SELENIUM_PROMISE_MANAGER: true,
    framework: 'mocha',
    mochaOpts: {
        //grep: testName,
        timeout: 60000,
    },
    multiCapabilities: [
        {
            browserName: 'chrome',
            enableVNC: false,
            shardTestFiles: true,
            maxInstances: 10
        },
    ],

    afterLaunch: function (exitCode) {
        console.timeEnd('protractorTime')
        // Unfortunatelly protractor programmatic usage is really limited
        //global.AWS_LAMBDA_CALLBACK && global.AWS_LAMBDA_CALLBACK()
    }
};

exports.config = conf;