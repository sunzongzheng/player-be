import { CronJob } from 'cron'
import { updateSongInfo, getNeteaseRank } from './scripts'

export default function() {
    const job = new CronJob(
        '00 00 */6 * * *',
        async () => {
            console.info('定时任务开始')
            // 更新歌曲信息
            // await updateSongInfo()
            // 获取网易云排行榜
            await getNeteaseRank()
            console.info('定时任务结束')
        },
        () => {},
        true,
        'Asia/Shanghai'
    )
}
