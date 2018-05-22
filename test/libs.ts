import chai from 'chai'
import chaiHttp from 'chai-http'
import models from '@models'
import encrypt from '@libs/encrypt'

chai.use(chaiHttp)

export const app = require('@src/app').default
export const expect = chai.expect
export const agent = chai.request.agent(app)
export async function createTestUser(): Promise<{
  info: Schema.user
  accesstoken: string
}> {
  const user = await models.user.create({
    sn: Math.random(),
    unionid: Math.random(),
    nickname: Math.random(),
    avatar: Math.random(),
    sourceData: {},
  })
  return {
    info: user.dataValues,
    accesstoken: encrypt.encode({
      id: user.id,
    }),
  }
}
export async function deleteTestUser(id: number): Promise<Number> {
  return await models.user.destroy({
    where: {
      id,
    },
  })
}
export async function createTestPlaylist(
  user_id: number
): Promise<Schema.playlist> {
  const rs = await models.playlist.create({
    name: Math.random(),
    user_id,
  })
  return rs.dataValues
}
export async function deleteTestPlaylist(id: number): Promise<Number> {
  return await models.playlist.destroy({
    where: {
      id,
    },
  })
}
export async function deleteTestPlaylistSong(id: number): Promise<Number> {
  return await models.playlist_song.destroy({
    where: {
      id,
    },
  })
}
export async function deleteTestSong(id: number): Promise<Number> {
  return await models.song.destroy({
    where: {
      id,
    },
  })
}
export default chai
