import chai, {
  expect,
  app,
  createTestUser,
  deleteTestUser,
  agent,
  createTestPlaylist,
  deleteTestPlaylist,
  deleteTestPlaylistSong,
  deleteTestSong,
} from '@test'
import models from '@models'
import _ from 'lodash'

describe('/playlist/:id', () => {
  let user: { accesstoken: string; info: Schema.user }
  let playlist: Schema.playlist
  let song: Schema.song
  let playlist_song: Schema.playlist_song
  let URL: string
  const defaultSong = {
    id: '123',
    vendor: 'netease',
    commentId: '123',
    name: '歌曲1',
    album: {
      id: '12',
      name: '专辑1',
      cover: 'https://www.baidu.com',
    },
    artists: [
      {
        id: '1',
        name: '歌手1',
      },
      {
        id: '2',
        name: '歌手2',
      },
    ],
    cp: false,
  }
  before(async () => {
    // 新建用户
    user = await createTestUser()
    // 注册session
    agent.get('/user').set('accesstoken', user.accesstoken)
    // 新建歌单
    playlist = await createTestPlaylist(user.info.id)
    URL = `/playlist/${playlist.id}`
  })
  after(async () => {
    // 删除创建的歌单
    await deleteTestPlaylist(playlist.id)
    // 删除歌曲
    await deleteTestSong(song.id)
    // 删除用户
    await deleteTestUser(user.info.id)
  })

  it('无权限的歌单 403', () => {
    return agent
      .get('/playlist/6553555')
      .set('accesstoken', user.accesstoken)
      .then(res => {
        expect(res.status).to.equal(403)
      })
  })
  it('修改歌单名称 不传歌单名称 400', () => {
    return agent
      .put(URL)
      .set('accesstoken', user.accesstoken)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('修改歌单名称 歌单名称超过20个字符 400', () => {
    return agent
      .put(URL)
      .set('accesstoken', user.accesstoken)
      .send({
        name: '123456789012345678901',
      })
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('修改歌单名称 成功 200', () => {
    const name = '12345678901234567890'
    return agent
      .put(URL)
      .set('accesstoken', user.accesstoken)
      .send({
        name,
      })
      .then(async res => {
        const check = await models.playlist.findOne({
          where: {
            id: playlist.id,
            name,
          },
        })
        expect(check).to.not.equal(null)
        expect(res.status).to.equal(200)
      })
  })
  it('收藏歌曲 不传id 400', () => {
    const params = _.cloneDeep(defaultSong)
    delete params.id
    return agent
      .post(URL)
      .set('accesstoken', user.accesstoken)
      .send(params)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('收藏歌曲 不传vendor 400', () => {
    const params = _.cloneDeep(defaultSong)
    delete params.vendor
    return agent
      .post(URL)
      .set('accesstoken', user.accesstoken)
      .send(params)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('收藏歌曲 vendor错误 400', () => {
    const params = _.cloneDeep(defaultSong)
    params.vendor = 'qq1'
    return agent
      .post(URL)
      .set('accesstoken', user.accesstoken)
      .send(params)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('收藏歌曲 不传commentId 400', () => {
    const params = _.cloneDeep(defaultSong)
    delete params.commentId
    return agent
      .post(URL)
      .set('accesstoken', user.accesstoken)
      .send(params)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('收藏歌曲 不传name 400', () => {
    const params = _.cloneDeep(defaultSong)
    delete params.name
    return agent
      .post(URL)
      .set('accesstoken', user.accesstoken)
      .send(params)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('收藏歌曲 不传album 400', () => {
    const params = _.cloneDeep(defaultSong)
    delete params.album
    return agent
      .post(URL)
      .set('accesstoken', user.accesstoken)
      .send(params)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('收藏歌曲 album格式不正确 400', () => {
    const params = _.cloneDeep(defaultSong)
    delete params.album.id
    return agent
      .post(URL)
      .set('accesstoken', user.accesstoken)
      .send(params)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('收藏歌曲 不传artists 400', () => {
    const params = _.cloneDeep(defaultSong)
    delete params.artists
    return agent
      .post(URL)
      .set('accesstoken', user.accesstoken)
      .send(params)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('收藏歌曲 artists格式不正确 400', () => {
    const params = _.cloneDeep(defaultSong)
    delete params.artists[0].id
    return agent
      .post(URL)
      .set('accesstoken', user.accesstoken)
      .send(params)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('收藏歌曲 不传cp 400', () => {
    const params = _.cloneDeep(defaultSong)
    delete params.cp
    return agent
      .post(URL)
      .set('accesstoken', user.accesstoken)
      .send(params)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('收藏歌曲 cp非boolean 400', () => {
    const params = _.cloneDeep(defaultSong)
    params.cp = 12 as any
    return agent
      .post(URL)
      .set('accesstoken', user.accesstoken)
      .send(params)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('收藏歌曲 成功 200', () => {
    const params = _.cloneDeep(defaultSong)
    return agent
      .post(URL)
      .set('accesstoken', user.accesstoken)
      .send(params)
      .then(async res => {
        expect(res.status).to.equal(200)
        // song表有这首歌
        let check = await models.song.findOne({
          where: {
            songId: params.id,
            vendor: params.vendor,
          },
        })
        expect(check).to.not.equal(null)
        song = check.dataValues
        // playlist_song表有关联记录
        check = await models.playlist_song.findOne({
          where: {
            song_id: song.id,
            playlist_id: playlist.id,
          },
        })
        expect(check).to.not.equal(null)
        playlist_song = check.dataValues
      })
  })
  it('获取歌单歌曲 成功 200', () => {
    return agent
      .get(URL)
      .set('accesstoken', user.accesstoken)
      .then(res => {
        expect(res.status).to.equal(200)
        expect(res.body).to.be.a('array')
        expect(res.body[0].id).equals(song.id)
      })
  })
  it('取消收藏 不传ID 400', () => {
    return agent
      .del(URL)
      .set('accesstoken', user.accesstoken)
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('取消收藏 错误的ID 400', () => {
    return agent
      .del(URL)
      .set('accesstoken', user.accesstoken)
      .query({
        id: -1,
      })
      .then(res => {
        expect(res.status).to.equal(400)
      })
  })
  it('取消收藏 成功 200', () => {
    return agent
      .del(URL)
      .set('accesstoken', user.accesstoken)
      .query({
        id: playlist_song.song_id,
      })
      .then(res => {
        expect(res.status).to.equal(200)
      })
  })
})
