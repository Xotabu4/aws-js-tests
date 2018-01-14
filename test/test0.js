describe('Suite #1', function () {
    it('Test #1', function (done) {
        console.log('Suite #1 Test #1 done!')
        setTimeout(done, 1000)
    })
    it('Test #2', function (done) {
        console.log('Suite #1 Test #2 done!')
        setTimeout(done, 1000)
    })
    it('Test #3', function (done) {
        console.log('Suite #1 Test #3 done!')
        setTimeout(done, 1000)
    })
})

describe('Suite #2', function () {
    it('Test #1', function (done) {
        console.log('Suite #2 Test #1 done!')
        setTimeout(done, 1000)
    })
    it('Test #2', function (done) {
        console.log('Suite #2 Test #2 done!')
        setTimeout(done, 1000)
    })
    it('Test #3', function (done) {
        console.log('Suite #2 Test #3 done!')
        setTimeout(done, 1000)
    })
}) 