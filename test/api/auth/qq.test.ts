import chai, { expect, app } from '@test'

describe('/auth/qq', () => {
    it('跳转到QQ登录', () => {
        return chai
            .request(app)
            .get('/auth/qq')
            .then(res => {
                expect(res).to.redirect
                expect(res.status).to.equal(200)
            })
    })
})
