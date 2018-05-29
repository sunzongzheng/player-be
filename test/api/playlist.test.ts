import chai, { expect, app, createTestUser, agent, deleteTestUser } from '@test'
import moment from 'moment'
import models from '@models'

const URL = '/playlist'
describe(URL, () => {
    let user: any
    let playlist_id: number
    let playlist_name: string
    before(async () => {
        user = await createTestUser()
        return agent.get('/user').set('accesstoken', user.accesstoken)
    })
    after(async () => {
        // 删除用户
        await deleteTestUser(user.info.id)
    })

    it('新增歌单 不传歌单名称 400', () => {
        return agent
            .post(URL)
            .set('accesstoken', user.accesstoken)
            .then(res => {
                expect(res.status).to.equal(400)
            })
    })
    it('新增歌单 歌单名称超过20个字符 400', () => {
        return agent
            .post(URL)
            .send({
                name: '123456789012345678901',
            })
            .set('accesstoken', user.accesstoken)
            .then(res => {
                expect(res.status).to.equal(400)
            })
    })
    it('新增歌单 成功 返回歌单名称和ID 200', () => {
        return agent
            .post(URL)
            .send({
                name: moment().format('YYYY-MM-DD HH:mm:ss'),
            })
            .set('accesstoken', user.accesstoken)
            .then(async res => {
                playlist_id = res.body.id
                playlist_name = res.body.name
                expect(res.status).to.equal(200)
                expect(res.body).to.have.all.keys('id', 'name')
                const data = await models.playlist.findOne({
                    where: {
                        id: playlist_id,
                    },
                })
                expect(data).to.not.equal(null)
            })
    })
    it('新增同名歌单 400', () => {
        return agent
            .post(URL)
            .send({
                name: playlist_name,
            })
            .set('accesstoken', user.accesstoken)
            .then(async res => {
                expect(res.status).to.equal(400)
            })
    })
    it('获取歌单列表 成功 返回歌单数组', () => {
        return agent
            .get(URL)
            .set('accesstoken', user.accesstoken)
            .then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.a('array')
                expect(res.body[0].id).equals(playlist_id)
            })
    })
    it('删除歌单 不传id 400', () => {
        return agent
            .del(URL)
            .set('accesstoken', user.accesstoken)
            .then(res => {
                expect(res.status).to.equal(400)
            })
    })
    it('删除歌单 成功 200', () => {
        return agent
            .del(URL)
            .query({
                id: playlist_id,
            })
            .set('accesstoken', user.accesstoken)
            .then(async res => {
                expect(res.status).to.equal(200)
                const data = await models.playlist.findOne({
                    where: {
                        id: playlist_id,
                    },
                })
                expect(data).to.equal(null)
            })
    })
    it('删除歌单 错误的歌单ID 400', () => {
        return agent
            .get('/playlist/2s')
            .set('accesstoken', user.accesstoken)
            .then(res => {
                expect(res.status).to.equal(400)
            })
    })
})
