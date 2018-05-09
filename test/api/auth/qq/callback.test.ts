import chai, { expect, app } from "@test"

describe("/auth/qq/callback", () => {
    it("无code跳转到QQ登录", () => {
        return chai
            .request(app)
            .get("/auth/qq/callback")
            .then(res => {
                expect(res).to.redirect
                expect(res.status).to.equal(200)
            })
    })
    it("错误的code返400", () => {
        return chai
            .request(app)
            .get("/auth/qq/callback?code=1")
            .then(res => {
                expect(res.status).to.equal(400)
            })
    })
})
