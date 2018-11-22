import SlackInvite from './lib/app'
import awsServerlessExpress from 'aws-serverless-express'

exports.init = (event, context) => {
    var options = {
        subdomain: process.env.SLACK_SUBDOMAIN,
        token: process.env.SLACK_API_TOKEN,
        gcaptcha_secret: process.env.GOOGLE_CAPTCHA_SECRET,
        gcaptcha_sitekey: process.env.GOOGLE_CAPTCHA_SITEKEY,
        path: process.env.BASE_PATH || '/',
        notification_channel: process.env.NOTIFICATION_CHANNEL,
        notification_username:
            process.env.NOTIFICATION_USERNAME || 'Notification',
    }
    var app = SlackInvite(options)
    const server = awsServerlessExpress.createServer(app)
    awsServerlessExpress.proxy(server, event, context)
}
