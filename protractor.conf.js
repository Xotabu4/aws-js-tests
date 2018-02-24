
let conf = {
    seleniumAddress: process.env.SELENOID_URL || 'http://ip-5236.sunline.net.ua:4444/wd/hub',
    baseUrl: 'https://www.facebook.com/',
    specs: ['./tests/*.js'],
    // Since AWS does not support async/await
    SELENIUM_PROMISE_MANAGER: true,
    // To be closer with actual multithreading
    restartBrowserBetweenTests: true,
    framework: 'mocha',
    mochaOpts: {
        //grep: testName,
        timeout: 60000,
        reporter: 'mocha-allure-reporter'
    },
    multiCapabilities: [
        {
            browserName: 'chrome',
            enableVNC: true,
            // shardTestFiles: true,
            // maxInstances: 10
            name: 'AWS LAMBDA'
        },
    ],
    beforeLaunch: function () {
        console.time('protractorTime')
    },

    afterLaunch: function (exitCode) {
        console.timeEnd('protractorTime')
        if (global.XML_RESULTS) {
            console.log('ALLURE results added to global.XML_RESULTS !')
            // console.log(global.XML_RESULTS)
        }
        // Unfortunatelly protractor programmatic usage is really limited
        //global.AWS_LAMBDA_CALLBACK && global.AWS_LAMBDA_CALLBACK()
    }
};

exports.config = conf;