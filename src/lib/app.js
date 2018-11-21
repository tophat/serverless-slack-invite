import express from 'express'
import bodyParser from 'body-parser'
import { Server as http } from 'http'
import remail from 'email-regex'
import cors from 'cors'
import request from 'superagent'
import path from 'path'

import badge from './badge'
import Slack from './slack'

export default function SlackInvite({
    token,
    interval = 5000,
    subdomain,
    gcaptcha_secret,
    gcaptcha_sitekey,
    server = false
}) {
    let app = express()
    app.use('/assets', express.static(path.join(__dirname, 'assets')))
    app.use(bodyParser.json({ strict: false }))

    let assets = __dirname + '/assets'

    let slack = new Slack({
        token,
        subdomain
    })

    app.options('*', cors())
    app.use(cors())

    app.get('/', (req, res) => {
        res.json({ success: true })
    })

    app.post('/invite', (req, res) => {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ msg: 'No email provided' })
        }

        if (!remail().test(email)) {
            return res.status(400).json({ msg: 'Invalid email' })
        }

        slack
            .invite({ email })
            .then(() => {
                res.json({ success: true })
            })
            .catch(err => {
                res.status(401).json({ success: false, message: err.message })
            })
    })

    app.get('/stats', (req, res) => {
        slack
            .getUsersStats({})
            .then(stats => {
                res.json({ success: true, stats })
            })
            .catch(err => {
                res.status(401).json({ success: false, message: err.message })
            })
    })

    app.get('/badge.svg', (req, res) => {
        res.type('svg')
        res.set('Cache-Control', 'max-age=0, no-cache')
        res.set('Pragma', 'no-cache')

        slack
            .getUsersStats({})
            .then(stats => {
                res.send(badge(stats).toHTML())
            })
            .catch(err => {
                res.send(badge({ active: 0, total: 0 }).toHTML())
            })
    })

    return app
}
