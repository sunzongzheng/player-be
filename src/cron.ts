import { commentId, artists } from './validator/song'
import { CronJob } from 'cron'
import _ from 'lodash'
import { updateSongInfo, move } from './scripts'

export default function() {
    const job = new CronJob(
        '00 00 */6 * * *',
        async () => {
            // 更新歌曲信息
            updateSongInfo()
            // 旧数据迁移
            move()
        },
        () => {},
        true,
        'Asia/Shanghai'
    )
}
