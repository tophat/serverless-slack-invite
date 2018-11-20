import SlackInvite from './app'
import { Server as http } from 'http'

const hostname = '0.0.0.0'
const port = 3000

var options = {
    org: process.env.SLACK_SUBDOMAIN,
    token: process.env.SLACK_API_TOKEN,
    gcaptcha_secret: process.env.GOOGLE_CAPTCHA_SECRET,
    gcaptcha_sitekey: process.env.GOOGLE_CAPTCHA_SITEKEY,
    path: process.env.BASE_PATH || '/'
}

var app = SlackInvite(options)
let srv = http(app)
srv.app = app

srv.listen(port, hostname, function(err) {
    if (err) throw err
    console.log('%s – listening on %s:%d', new Date(), hostname, port)
})
