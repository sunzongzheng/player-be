import models from '@models'
import musicApi from '@suen/music-api'
import Sequelize from 'sequelize'
import moment from 'moment'
import config from 'config'
import _ from 'lodash'
import { vendor } from '@types'
import redis from '@redis'
import { Op } from 'sequelize'

export async function updateSongInfo(): Promise<void> {
    const songs = await models.song.findAll()
    // 分类
    const songsList: { [key in Schema.vendor]: Array<Schema.song> } = {
        [vendor.netease]: [],
        [vendor.xiami]: [],
        [vendor.qq]: [],
    }
    songs.forEach((item: Schema.song) => {
        songsList[item.vendor].push(item)
    })
    const doUpdate = async (vendor: vendor, list: Array<Schema.song>) => {
        const ids = list.map(item => item.songId)
        const data = await musicApi.getBatchSongDetail(vendor, ids)
        if (data.status) {
            const songsObject: {
                [key: string]: musicApi.musicInfo
            } = {}
            data.data.forEach(item => {
                songsObject[item.id.toString()] = item
            })
            // 遍历数据库中的数据
            for (let info of list) {
                // 已存的信息
                const defaultInfo = {
                    name: info.name,
                    artists: info.artists,
                    cp: info.cp,
                }
                const item = songsObject[info.songId]
                if (item) {
                    // 待更新的信息
                    const updateInfo = {
                        name: item.name,
                        artists: item.artists,
                        cp: item.cp,
                    }
                    // 比对是否相等
                    if (!_.isEqual(updateInfo, defaultInfo)) {
                        try {
                            await models.song.update(updateInfo, {
                                where: {
                                    id: info.id,
                                },
                            })
                            console.log('update success: %s', info.name)
                        } catch (e) {
                            console.error('update fail: %s', info.name)
                        }
                    }
                } else {
                    // 歌曲信息不存在 代表音乐平台把歌曲删了
                    console.log(info.vendor, info.name, info.songId)
                    if (!info.cp) {
                        try {
                            await models.song.update(
                                {
                                    cp: true,
                                },
                                {
                                    where: {
                                        id: info.id,
                                    },
                                }
                            )
                            console.log('update success: %s', info.name)
                        } catch (e) {
                            console.error('update fail: %s', info.name)
                        }
                    }
                }
            }
        } else {
            console.error('getDetail fail: %s', vendor)
        }
    }
    for (let key of Object.keys(songsList)) {
        const _key = key as vendor
        const list = songsList[_key]
        if (_key === vendor.qq) {
            let arr: Array<Schema.song> = []
            for (let index = 0; index < list.length; index++) {
                arr.push(list[index])
                if (arr.length === 50 || index + 1 === list.length) {
                    // 每50首更新一次
                    await doUpdate(_key, arr)
                    arr = []
                }
            }
        } else {
            await doUpdate(_key, list)
        }
    }
    console.log('updateSongInfo down')
}

export async function getNeteaseRank(): Promise<void> {
    for (let i = 0; i <= 21; i++) {
        const data = await musicApi.netease.getTopList(i.toString())
        if (data.status) {
            redis.set(`netease-rank-${i}`, JSON.stringify(data.data))
        } else {
            console.log(`获取网易云排行榜失败：${i}, ${JSON.stringify(data)}`)
        }
    }
}

export async function getQQRank(): Promise<Array<Object>> {
    const totalData = await musicApi.qq.getAllTopList()
    if (totalData.status) {
        const total = []
        for (let single of totalData.data) {
            const data = await musicApi.qq.getTopList(single.id)
            if (data.status) {
                data.data.id = single.id
                total.push(data.data)
                redis.set(`qq-rank-${single.id}`, JSON.stringify(data.data))
            } else {
                console.log(`获取QQ音乐排行榜失败：${i}, ${JSON.stringify(data)}`)
            }
        }
        redis.set(`qq-rank-total`, JSON.stringify(total))
        return total
    } else {
        console.log(`获取QQ音乐 全部排行榜失败, ${JSON.stringify(totalData)}`)
        return []
    }
}
