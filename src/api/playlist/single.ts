import express from '@libs/express'
import models from '@models'
import { schema, validate } from '@libs/validator'
import { Forbidden, BadRequest, SystemError } from '@libs/error'
import { name } from '@validator/playlist'
import { id } from '@validator/playlist_song'
import ValidatorSong from '@validator/song'
import sequelize, { Sequelize, Model, Models, Utils } from 'sequelize'

export default express()
    // 检查权限
    .use('/', async (req, res, next) => {
        const check = await models.playlist.findOne({
            where: {
                id: res.locals.id,
                user_id: res.locals.session.meta.id,
            },
        })
        if (check) {
            next()
        } else {
            throw new Forbidden()
        }
    })
    .get('/', async (req, res) => {
        const data: Array<{
            song: Schema.song
        }> = await models.playlist_song.findAll({
            where: {
                playlist_id: res.locals.id,
            },
            attributes: [],
            include: [
                {
                    model: models.song,
                    attributes: ['id', 'songId', 'vendor', 'commentId', 'name', 'album', 'artists', 'cp'],
                },
            ],
            order: [['createdAt', 'DESC']],
        })
        res.send(data.map(item => item.song))
    })
    .put(
        '/',
        schema({
            name,
        }),
        async (req: express.Request, res: express.Response) => {
            validate(req).throw()
            const data = await models.playlist.update(
                {
                    name: req.body.name,
                },
                {
                    where: {
                        id: res.locals.id,
                        user_id: res.locals.session.meta.id,
                    },
                }
            )
            if (data[0]) {
                res.send({})
            } else {
                throw new SystemError('操作失败')
            }
        }
    )
    .post('/', schema(ValidatorSong), async (req: express.Request, res: express.Response) => {
        validate(req).throw()
        return models.sequelize
            .transaction((t: any) => {
                const where = {
                    songId: req.body.id.toString(),
                    vendor: req.body.vendor,
                }
                const defaults = {
                    commentId: req.body.commentId.toString(),
                    name: req.body.name,
                    album: req.body.album,
                    artists: req.body.artists,
                    cp: req.body.cp,
                }
                // 更新或插入 song表
                return models.song
                    .findOrCreate({
                        where,
                        defaults,
                        transaction: t,
                    })
                    .then((data: Array<any>) => {
                        const record: Schema.song = data[0]
                        const created: Boolean = data[1]
                        // 创建收藏记录
                        const createCollection = () => {
                            return models.playlist_song.create(
                                {
                                    song_id: record.id,
                                    playlist_id: res.locals.id,
                                },
                                { transaction: t }
                            )
                        }
                        if (created) {
                            return createCollection()
                        } else {
                            return models.song
                                .update(
                                    {
                                        ...defaults,
                                    },
                                    {
                                        where,
                                        transaction: t,
                                    }
                                )
                                .then(() => {
                                    return createCollection()
                                })
                        }
                    })
            })
            .then(() => {
                res.send({})
            })
            .catch((e: any) => {
                if (e.errors && e.errors[0] && e.errors[0].type === 'unique violation') {
                    throw new BadRequest('歌曲已存在！')
                } else {
                    throw new Error(e)
                }
            })
    })
    .delete(
        '/',
        schema({
            id,
        }),
        async (req: express.Request, res: express.Response) => {
            validate(req).throw()
            const data = await models.playlist_song.destroy({
                where: {
                    song_id: req.query.id,
                    playlist_id: res.locals.id,
                },
            })
            if (data) {
                res.send({
                    status: true,
                })
            } else {
                throw new BadRequest('ID错误或无权操作', data)
            }
        }
    )
