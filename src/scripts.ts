import models from '@models'
import musicApi from 'music-api'
import Sequelize from 'sequelize'
import moment from 'moment'
import config from 'config'
import _ from 'lodash'

export async function updateSongInfo(): Promise<void> {
    const songs = await models.song.findAll()
    songs.forEach((item: Schema.song) => {
        musicApi.getSongDetail(item.vendor, item.songId).then(data => {
            if (data.status) {
                const info = data.data
                const updateInfo = {
                    commentId: info.commentId + '',
                    name: info.name,
                    artists: info.artists,
                    cp: info.cp,
                }
                const defaultInfo = {
                    commentId: item.commentId,
                    name: item.name,
                    artists: item.artists,
                    cp: item.cp,
                }
                if (!_.isEqual(updateInfo, defaultInfo)) {
                    models.song
                        .update(updateInfo, {
                            where: {
                                id: item.id,
                            },
                        })
                        .then(() => {
                            console.log('歌曲更新成功：%s', item.name)
                        })
                }
            } else {
                console.error('歌曲更新失败：%s', item.name)
            }
        })
    })
}

export function move(): void {
    const last = new Sequelize(config.get('oldSequelize'))
    const next = new Sequelize(config.get('sequelize'))

    function transferUser() {
        return new Promise(resolve => {
            last
                .query('SELECT * from `users`')
                .spread((results: Array<{ [propName: string]: string | number }>, metadata) => {
                    results.forEach(info => {
                        const values = {
                            '`id`': info.id,
                            '`sn`': `'${info.sn}'`,
                            '`nickname`': `'${info.nickname}'`,
                            '`avatar`': `'${info.avatar}'`,
                            '`sourceData`': `'${JSON.stringify(info.sourceData)}'`,
                            '`from`': `'${info.from}'`,
                            '`createdAt`': `'${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')}'`,
                            '`updatedAt`': `'${moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss')}'`,
                            '`unionid`': `'${info.unionid}'`,
                        }
                        const sql = `INSERT INTO \`user\` (${Object.keys(values).join(',')}) VALUES(${Object.values(
                            values
                        )
                            .join(',')
                            .replace(/[\\]/g, '\\\\')})`
                        try {
                            next.query(sql).catch(e => {})
                        } catch (e) {}
                    })
                    resolve()
                })
        })
    }
    function transferPlaylist() {
        return new Promise(resolve => {
            last
                .query('SELECT * from `playlists`')
                .spread((results: Array<{ [propName: string]: string | number }>, metadata) => {
                    results.forEach(info => {
                        const values = {
                            '`id`': info.id,
                            '`name`': `'${info.name}'`,
                            '`user_id`': info.user_id,
                            '`createdAt`': `'${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')}'`,
                            '`updatedAt`': `'${moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss')}'`,
                        }
                        const sql = `INSERT INTO \`playlist\` (${Object.keys(values).join(',')}) VALUES(${Object.values(
                            values
                        )
                            .join(',')
                            .replace(/[\\]/g, '\\\\')})`
                        try {
                            next.query(sql).catch(e => {})
                        } catch (e) {}
                    })
                    resolve()
                })
        })
    }
    function transferPlaylist_song() {
        return new Promise(resolve => {
            last
                .query('SELECT * from `song_playlists`')
                .spread(async (results: Array<{ [propName: string]: any }>, metadata) => {
                    for (let i in results) {
                        const info = results[i]
                        if (info.vendor === 'qq') {
                            const data = await musicApi.getSongDetail('qq', info.song_id)
                            if (!data.status) continue
                            info.commentId = data.data.commentId
                        }
                        if (info.sourceData) {
                            const songValues = {
                                '`songId`': `'${info.song_id}'`,
                                '`vendor`': `'${info.vendor}'`,
                                '`commentId`': `'${info.commentId}'`,
                                '`name`': `'${info.sourceData.name}'`,
                                '`album`': `'${JSON.stringify(info.sourceData.album)}'`,
                                '`artists`': `'${JSON.stringify(info.sourceData.artists)}'`,
                                '`cp`': info.sourceData.cp,
                                '`createdAt`': `'${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')}'`,
                                '`updatedAt`': `'${moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss')}'`,
                            }
                            const songSql = `INSERT INTO \`song\` (${Object.keys(songValues).join(
                                ','
                            )}) VALUES(${Object.values(songValues)
                                .join(',')
                                .replace(/[\\]/g, '\\\\')})`

                            try {
                                const data = await next.query(songSql)
                                const playlist_songValues = {
                                    '`song_id`': data[0],
                                    '`playlist_id`': info.playlist_id,
                                    '`createdAt`': `'${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')}'`,
                                    '`updatedAt`': `'${moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss')}'`,
                                }
                                const playlist_songSql = `INSERT INTO \`playlist_song\` (${Object.keys(
                                    playlist_songValues
                                ).join(',')}) VALUES(${Object.values(playlist_songValues)
                                    .join(',')
                                    .replace(/[\\]/g, '\\\\')})`
                                next.query(playlist_songSql).catch(e => {})
                            } catch (e) {}
                        }
                    }
                })
        })
    }
    transferUser()
        .then(() => {
            transferPlaylist().then(() => {
                transferPlaylist_song()
            })
        })
        .catch(e => {})
}
