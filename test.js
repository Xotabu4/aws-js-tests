function TEST() {
    browser.get('')
    try {
        browser.wait(EC.invisibilityOf($('body')), global['SLEEP_TIMEOUT'])
    } catch (error) {
        console.log('successfully errored as expected')
    }
    try {
        browser.wait(EC.invisibilityOf($('body')), global['SLEEP_TIMEOUT'])
    } catch (error) {
        console.log('successfully errored as expected')
    }
    try {
        browser.wait(EC.invisibilityOf($('body')), global['SLEEP_TIMEOUT'])
    } catch (error) {
        console.log('successfully errored as expected')
    }
    try {
        browser.wait(EC.invisibilityOf($('body')), global['SLEEP_TIMEOUT'])
    } catch (error) {
        console.log('successfully errored as expected')
    }
    try {
        browser.wait(EC.invisibilityOf($('body')), global['SLEEP_TIMEOUT'])
    } catch (error) {
        console.log('successfully errored as expected')
    }
    browser.sleep(global['SLEEP_TIMEOUT'])
}

exports.TEST = TEST;