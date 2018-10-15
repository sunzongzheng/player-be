import express from 'express'
import { webhookScript } from './scripts'

const app = express()

app.get('/', (req, res) => {
    webhookScript()
    res.send('success')
})

app.listen(8080)
