import chai, { expect, app } from '@test'

const URL = '/auth/qq/android'
describe(URL, () => {
  it('不传参数 400', () => {
    return chai
      .request(app)
      .get(URL)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('不传openid 400', () => {
    return chai
      .request(app)
      .get(URL)
      .query({
        access_token: '123',
      })
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('获取用户信息失败 400', () => {
    return chai
      .request(app)
      .get(URL)
      .query({
        access_token: '123',
        openid: '321',
      })
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
})
