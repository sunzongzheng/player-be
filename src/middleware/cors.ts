import express from '@libs/express'

const router = express()

router.all('*', (req, res, next) => {
    const allowOrigins: Array<string | undefined> = [
        'https://graph.qq.com',
        'http://localhost:9080',
        'https://music-lake.zzsun.cc',
    ]
    const allowHeaders = [
        'Content-Type',
        'Content-Length',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'accesstoken',
    ]
    const origin = req.headers.origin as string
    if (allowOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Headers', allowHeaders.join(', '))
        res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    }
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
})

export default router
