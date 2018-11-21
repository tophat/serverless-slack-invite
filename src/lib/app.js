import express from 'express'
import bodyParser from 'body-parser'
import validator from 'validator'
import cors from 'cors'
import path from 'path'

import badge from './badge'
import Slack from './slack'

export default function SlackInvite({ token, subdomain }) {
    let app = express()
    app.use('/assets', express.static(path.join(__dirname, 'assets')))
    app.use(bodyParser.json({ strict: false }))

    let slack = new Slack({
        token,
        subdomain,
    })

    app.options('*', cors())
    app.use(cors())

    app.get('/', (req, res) => {
        res.json({ success: true })
    })

    app.post('/invite', (req, res) => {
        const email = req.body.email

        if (!email) {
            return res
                .status(400)
                .json({ success: false, msg: 'No email provided' })
        }

        if (!validator.isEmail(email)) {
            return res
                .status(400)
                .json({ success: false, msg: 'Invalid email' })
        }

        slack
            .invite({ email })
            .then(() => {
                res.json({ success: true })
            })
            .catch(err => {
                res.status(400).json({ success: false, message: err.message })
            })
    })

    app.get('/stats', (req, res) => {
        slack
            .getUsersStats({})
            .then(stats => {
                res.json({ success: true, stats })
            })
            .catch(err => {
                res.status(400).json({ success: false, message: err.message })
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
            .catch(() => {
                res.send(badge({ active: 0, total: 0 }).toHTML())
            })
    })

    return app
}
