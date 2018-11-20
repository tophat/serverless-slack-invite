import SlackInvite from './app'
import awsServerlessExpress from 'aws-serverless-express'

exports.init = (event, context) => {
    var options = {
        org: process.env.SLACK_SUBDOMAIN,
        token: process.env.SLACK_API_TOKEN,
        gcaptcha_secret: process.env.GOOGLE_CAPTCHA_SECRET,
        gcaptcha_sitekey: process.env.GOOGLE_CAPTCHA_SITEKEY,
        path: process.env.BASE_PATH || '/',
    }
    var app = SlackInvite(options)
    const server = awsServerlessExpress.createServer(app)
    awsServerlessExpress.proxy(server, event, context)
};
