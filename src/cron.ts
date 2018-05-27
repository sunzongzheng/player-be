import { commentId, artists } from './validator/song'
import { CronJob } from 'cron'
import models from '@models'
import musicApi from 'music-api'
import _ from 'lodash'

export default function() {
    const job = new CronJob(
        '00 00 */6 * * *',
        async () => {
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
        },
        () => {},
        true,
        'Asia/Shanghai'
    )
}
