import SlackInvite from './lib/app'
import { Server as http } from 'http'

const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = process.env.PORT || 3000

var options = {
    subdomain: process.env.SLACK_SUBDOMAIN,
    token: process.env.SLACK_API_TOKEN,
    gcaptcha_secret: process.env.GOOGLE_CAPTCHA_SECRET,
    gcaptcha_sitekey: process.env.GOOGLE_CAPTCHA_SITEKEY,
    path: process.env.BASE_PATH || '/',
    notification_channel: process.env.NOTIFICATION_CHANNEL,
    notification_username: process.env.NOTIFICATION_USERNAME || 'Notification',
}

var app = SlackInvite(options)
let srv = http(app)
srv.app = app

srv.listen(port, hostname, function(err) {
    if (err) throw err

    // eslint-disable-next-line
    console.log('%s – listening on %s:%d', new Date(), hostname, port)
})
