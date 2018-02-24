var SLEEP_TIMEOUT = 1 // ms

function TEST() {
    let counter = 0;
    browser.waitForAngularEnabled(false)
    browser.get('')
    
    /**
     * Wait for invisibility triggers a lot of requests, needed for more real-world testing 
     */
    function waitWithCounter() {
        counter = counter + 1
        return protractor.ExpectedConditions.stalenessOf($('body'))()
    }

    console.time('waited for')
    return browser.wait(waitWithCounter, SLEEP_TIMEOUT).then(undefined, function (err) {
        console.timeEnd('waited for')
        console.log('did', counter, 'requests to selenoid server')
    })
}

exports.TEST = TEST;