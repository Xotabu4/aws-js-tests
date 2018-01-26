let conf = {
    seleniumAddress: process.env.SELENOID_URL || 'http://ip-5236.sunline.net.ua:4444/wd/hub',
    baseUrl: 'http://www.protractortest.org/testapp/ng1/#/form',
    specs: ['./test/*.js'],
    SELENIUM_PROMISE_MANAGER: true,
    framework: 'mocha',
    multiCapabilities: [
        { browserName: 'chrome', enableVNC: true },
    ],
    // afterLaunch: function (exitCode) {
    //     // Unfortunatelly protractor programmatic usage is really limited
    //     //global.AWS_LAMBDA_CALLBACK && global.AWS_LAMBDA_CALLBACK()
    // }
};

exports.config = conf;