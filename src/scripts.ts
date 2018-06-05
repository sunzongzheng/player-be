import models from '@models'
import musicApi from 'music-api'
import Sequelize from 'sequelize'
import moment from 'moment'
import config from 'config'
import _ from 'lodash'
import { vendor } from '@types'

export async function updateSongInfo(): Promise<void> {
    const songs = await models.song.findAll()
    for (let item of songs) {
        if (item.vendor === 'netease') continue
        const data = await musicApi.getSongDetail(item.vendor, item.songId)
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
                        console.log('update success: %s', item.name)
                    })
                    .catch((e: Error) => {
                        console.error('update fail: %s', item.name)
                    })
            }
        } else {
            console.error('getDetail fail: %s %s %s', item.name, item.vendor, item.songId)
        }
        await new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, 1000)
        })
    }
    console.log('updateSongInfo down')
}

export async function move(): Promise<void> {
    const last = new Sequelize(config.get('oldSequelize'))
    const next = new Sequelize(config.get('sequelize'))

    const transferUser = async () => {
        const [results] = await last.query('SELECT * from `users`')
        for (let info of results) {
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
            const sql = `INSERT INTO \`user\` (${Object.keys(values).join(',')}) VALUES(${Object.values(values)
                .join(',')
                .replace(/[\\]/g, '\\\\')})`
            try {
                await next.query(sql)
            } catch (e) {}
        }
    }
    const transferPlaylist = async () => {
        const [results] = await last.query('SELECT * from `playlists`')
        for (let info of results) {
            const values = {
                '`id`': info.id,
                '`name`': `'${info.name}'`,
                '`user_id`': info.user_id,
                '`createdAt`': `'${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')}'`,
                '`updatedAt`': `'${moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss')}'`,
            }
            const sql = `INSERT INTO \`playlist\` (${Object.keys(values).join(',')}) VALUES(${Object.values(values)
                .join(',')
                .replace(/[\\]/g, '\\\\')})`
            try {
                await next.query(sql)
            } catch (e) {
                // console.warn(e)
            }
        }
    }
    const transferPlaylist_song = async () => {
        const [results] = await last.query('SELECT * from `song_playlists`')
        for (let info of results) {
            if (info.vendor === 'qq') {
                const data = await musicApi.getSongDetail(vendor.qq, info.song_id)
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
                const songSql = `INSERT INTO \`song\` (${Object.keys(songValues).join(',')}) VALUES(${Object.values(
                    songValues
                )
                    .join(',')
                    .replace(/[\\]/g, '\\\\')}) ON DUPLICATE KEY 
                    UPDATE ${Object.entries(songValues)
                        .map(item => item.join(' = '))
                        .join(',')}`

                let song_id
                try {
                    const data = await next.query(songSql)
                    song_id = data[0]
                } catch (e) {
                    // console.warn(e)
                }
                try {
                    const playlist_songValues = {
                        '`song_id`': song_id,
                        '`playlist_id`': info.playlist_id,
                        '`createdAt`': `'${moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')}'`,
                        '`updatedAt`': `'${moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss')}'`,
                    }
                    const playlist_songSql = `INSERT INTO \`playlist_song\` (${Object.keys(playlist_songValues).join(
                        ','
                    )}) VALUES(${Object.values(playlist_songValues)
                        .join(',')
                        .replace(/[\\]/g, '\\\\')})`
                    await next.query(playlist_songSql)
                } catch (e) {
                    // console.warn(e)
                }
            }
        }
    }
    await transferUser()
    console.log('transferUser down')
    await transferPlaylist()
    console.log('transferPlaylist down')
    await transferPlaylist_song()
    console.log('transferPlaylist_song down')
}
