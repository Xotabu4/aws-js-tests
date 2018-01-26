describe('Suite #1', function () {
    it('Test #1', function (done) {
        console.log('Suite #1 Test #1 done!')
        browser.get('/').then(done, done)
    })
    it('Test #2', function (done) {
        console.log('Suite #1 Test #2 done!')
        browser.sleep(1000).then(done, done)
    })
    it('Test #3', function (done) {
        console.log('Suite #1 Test #3 done!')
        browser.sleep(1000).then(done, done)
    })
})

describe('Suite #2', function () {
    it('Test #1', function (done) {
        console.log('Suite #2 Test #1 done!')
        browser.sleep(1000).then(done, done)
    })
    it('Test #2', function (done) {
        console.log('Suite #2 Test #2 done!')
        browser.sleep(1000).then(done, done)
    })
    it('Test #3', function (done) {
        console.log('Suite #2 Test #3 done!')
        browser.sleep(1000).then(done, done)
    })
}) 