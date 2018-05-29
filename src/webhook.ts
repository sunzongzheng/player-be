import http from 'http'
import createHandler from 'github-webhook-handler'
import config from 'config'
import { exec } from 'child_process'
import moment from 'moment'

const webhookConfig: Config.webhook = config.get('webhook')

const handler = createHandler({
    path: webhookConfig.path,
    secret: webhookConfig.secret,
})

const getMoment = () => moment().format('YYYY-MM-DD HH:mm:ss')

http
    .createServer((req, res) => {
        handler(req, res, err => {
            res.statusCode = 444
            res.end()
        })
    })
    .listen(webhookConfig.port)

handler.on('error', err => {
    console.error('%s: Error: %s', getMoment(), err.message)
})

handler.on('push', event => {
    if (event.payload.ref === 'refs/heads/master') {
        exec([`cd ${__dirname}/../`, 'git fetch --all', 'git reset --hard origin/master', 'npm i'].join(' && '), err => {
            if (err instanceof Error) {
                throw err
            }
        })
    }
    console.log('%s: Received a push event for %s to %s', getMoment(), event.payload.repository.name, event.payload.ref)
})

handler.on('issues', event => {
    console.log(
        '%s: Received an issue event for %s action=%s: #%d %s',
        getMoment(),
        event.payload.repository.name,
        event.payload.action,
        event.payload.issue.number,
        event.payload.issue.title
    )
})
