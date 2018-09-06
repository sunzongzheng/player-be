import express from '@libs/express'
import single from './playlist/single'
import models from '@models'
import { schema, validate } from '@libs/validator'
import { BadRequest } from '@src/libs/error'
import { name } from '@validator/playlist'

export default express()
    .get('/', async (req, res) => {
        const data = await models.playlist.findAll({
            where: {
                user_id: res.locals.session.meta.id,
            },
            include: [
                {
                    model: models.playlist_song,
                    attributes: ['playlist_id', 'song_id'],
                    include: [
                        {
                            model: models.song,
                            attributes: ['id', 'album'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC'], [models.playlist_song, 'createdAt', 'DESC']],
            attributes: ['id', 'name', 'createdAt'],
        })
        res.send(
            data.map((item: any) => {
                return {
                    id: item.id,
                    name: item.name,
                    createdAt: item.createdAt,
                    total: item.playlist_songs.length,
                    cover: item.playlist_songs[0] ? item.playlist_songs[0].song.album.cover : null,
                }
            })
        )
    })
    .post(
        '/',
        schema({
            name,
        }),
        async (req, res) => {
            validate(req).throw()
            try {
                const data = await models.playlist.create({
                    user_id: res.locals.session.meta.id,
                    name: req.body.name,
                })
                res.send({
                    name: data.name,
                    id: data.id,
                })
            } catch (e) {
                if (e.errors && e.errors[0] && e.errors[0].type === 'unique violation') {
                    throw new BadRequest('歌单已存在！')
                } else {
                    throw new Error(e)
                }
            }
        }
    )
    .delete(
        '/',
        schema({
            id: {
                in: ['query'],
                isEmpty: {
                    errorMessage: '歌单id不能为空',
                    negated: true,
                },
            },
        }),
        async (req, res) => {
            validate(req).throw()
            const data = await models.playlist.destroy({
                where: {
                    id: req.query.id,
                    user_id: res.locals.session.meta.id,
                },
            })
            if (data) {
                res.send({})
            } else {
                throw new BadRequest('歌单不存在')
            }
        }
    )
    // 检查参数并传递id
    .use(
        '/:id',
        schema({
            id: {
                in: ['params'],
                errorMessage: 'ID is wrong',
                isInt: true,
            },
        }),
        (req, res, next) => {
            validate(req).throw()
            res.locals.id = req.params.id
            next()
        }
    )
    .use('/:id', single)
