import models from '@models'
import musicApi from '@suen/music-api'
import Sequelize from 'sequelize'
import moment from 'moment'
import config from 'config'
import _ from 'lodash'
import { vendor } from '@types'

export async function updateSongInfo(): Promise<void> {
    const songs = await models.song.findAll()
    // 先打表
    const songsList: { [key in Schema.vendor]: Array<Schema.song> } = {
        [vendor.netease]: [],
        [vendor.xiami]: [],
        [vendor.qq]: [],
    }
    const songsObject: {
        [key in Schema.vendor]: {
            [key: string]: Schema.song
        }
    } = {
        [vendor.netease]: {},
        [vendor.xiami]: {},
        [vendor.qq]: {},
    }
    songs.forEach((item: Schema.song) => {
        songsList[item.vendor].push(item)
        songsObject[item.vendor][item.songId] = item
    })
    for (let key of Object.keys(songsList)) {
        const _key = key as vendor
        if (_key === vendor.netease) continue
        // 一次拿到所有歌曲信息
        const data = await musicApi.getBatchSongDetail(_key, songsList[_key].map(item => item.songId))
        if (data.status) {
            for (let info of data.data) {
                // 待更新的信息
                const updateInfo = {
                    commentId: info.commentId + '',
                    name: info.name,
                    artists: info.artists,
                    cp: info.cp,
                }
                // 数据库中已存的信息
                const item = songsObject[_key][info.id.toString()]
                const defaultInfo = {
                    commentId: item.commentId,
                    name: item.name,
                    artists: item.artists,
                    cp: item.cp,
                }
                // 比对是否相等
                if (!_.isEqual(updateInfo, defaultInfo)) {
                    try {
                        await models.song.update(updateInfo, {
                            where: {
                                id: item.id,
                            },
                        })
                        console.log('update success: %s', item.name)
                    } catch (e) {
                        console.error('update fail: %s', item.name)
                    }
                }
            }
        } else {
            console.error('getDetail fail: %s', key)
        }
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
