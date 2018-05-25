import http from 'http'
import createHandler from 'github-webhook-handler'
import config from 'config'
import { exec } from 'child_process'

const webhookConfig: Config.webhook = config.get('webhook')

const handler = createHandler({
  path: webhookConfig.path,
  secret: webhookConfig.secret,
})

http
  .createServer((req, res) => {
    handler(req, res, err => {
      res.statusCode = 444
      res.end()
    })
  })
  .listen(webhookConfig.port)

handler.on('error', err => {
  console.error('Error:', err.message)
})

handler.on('push', event => {
  if (event.payload.ref === 'refs/heads/master') {
    exec(['cd ../', 'git pull', 'npm i'].join(' && '), err => {
      if (err instanceof Error) {
        throw err
      }
    })
  }
  console.log(
    'Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref
  )
})

handler.on('issues', event => {
  console.log(
    'Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title
  )
})
