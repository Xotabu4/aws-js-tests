let SLEEP_TIMEOUT = 1000
function TEST() {
    browser.waitForAngularEnabled(false)
    browser.get('')
    try {
        browser.wait(EC.invisibilityOf($('body')), SLEEP_TIMEOUT)
    } catch (error) {
        console.log('successfully errored as expected')
    }
    try {
        browser.wait(EC.invisibilityOf($('body')), SLEEP_TIMEOUT)
    } catch (error) {
        console.log('successfully errored as expected')
    }
    try {
        browser.wait(EC.invisibilityOf($('body')), SLEEP_TIMEOUT)
    } catch (error) {
        console.log('successfully errored as expected')
    }
    try {
        browser.wait(EC.invisibilityOf($('body')), SLEEP_TIMEOUT)
    } catch (error) {
        console.log('successfully errored as expected')
    }
    try {
        browser.wait(EC.invisibilityOf($('body')), SLEEP_TIMEOUT)
    } catch (error) {
        console.log('successfully errored as expected')
    }
    browser.sleep(SLEEP_TIMEOUT)
}

exports.TEST = TEST;