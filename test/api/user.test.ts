import chai, { expect, app, createTestUser, agent, deleteTestUser } from '@test'
import moment from 'moment'
import models from '@models'

const URL = '/user'
describe(URL, () => {
    let user: any
    before(async () => {
        user = await createTestUser()
        return agent.get('/user').set('accesstoken', user.accesstoken)
    })
    after(async () => {
        // 删除用户
        await deleteTestUser(user.info.id)
    })

    it('获取用户信息 不传accesstoken 401', () => {
        return agent.get(URL).then(res => {
            expect(res.status).to.equal(401)
        })
    })
    it('获取用户信息 错误的accesstoken 401', () => {
        return agent
            .get(URL)
            .set('accesstoken', '123456')
            .then(res => {
                expect(res.status).to.equal(401)
            })
    })
    it('获取用户信息 成功 200', () => {
        return agent
            .get(URL)
            .set('accesstoken', user.accesstoken)
            .then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.have.all.keys('avatar', 'nickname')
            })
    })
})
