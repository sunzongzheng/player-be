import http from 'http'
import createHandler from 'github-webhook-handler'
import config from 'config'
import moment from 'moment'
import { webhookScript } from './scripts'

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
    console.log('%s: Received a push event for %s to %s', getMoment(), event.payload.repository.name, event.payload.ref)
    if (event.payload.ref === 'refs/heads/master') {
        webhookScript()
    }
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
