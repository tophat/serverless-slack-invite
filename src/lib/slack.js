import request from 'superagent'

export default class Slack {
    constructor({ token, subdomain }) {
        this.channelsByName = {}
        this.org = {}
        this.subdomain = subdomain
        this.token = token
        this.users = {}
    }

    invite({ email, channel }) {
        return new Promise((resolve, reject) => {
            let data = { email, token: this.token }

            if (channel) {
                data.channels = channel
                data.ultra_restricted = 1
                data.set_active = true
            }

            request
                .post(
                    `https://${
                        this.subdomain
                    }.slack.com/api/users.admin.invite`,
                )
                .type('form')
                .send(data)
                .end(function(err, res) {
                    if (err) return reject(err)
                    if (200 != res.status) {
                        reject(new Error(`Invalid response ${res.status}.`))
                        return
                    }

                    // If the account that owns the token is not admin, Slack will oddly
                    // return `200 OK`, and provide other information in the body. So we
                    // need to check for the correct account scope and call the callback
                    // with an error if it's not high enough.
                    let { ok, error: providedError, needed } = res.body
                    if (!ok) {
                        if (
                            providedError === 'missing_scope' &&
                            needed === 'admin'
                        ) {
                            reject(
                                new Error(
                                    `Missing admin scope: The token you provided is for an account that is not an admin.`,
                                ),
                            )
                        } else if (providedError === 'already_invited') {
                            reject(
                                new Error(
                                    'You have already been invited to Slack. Check for an email from feedback@slack.com.',
                                ),
                            )
                        } else if (providedError === 'already_in_team') {
                            reject(new Error(`Sending you to Slack...`))
                        } else {
                            reject(new Error(providedError))
                        }
                        return
                    }

                    resolve()
                })
        })
    }

    getUsers() {
        return new Promise((resolve, reject) => {
            request
                .get(`https://${this.subdomain}.slack.com/api/users.list`)
                .query({ token: this.token, presence: 1 })
                .end((err, res) => {
                    if (err) return reject(err)

                    if (!res.body.members || !res.body.members.length)
                        reject(new Error(`Invalid Slack response.`))

                    resolve(res.body.members)
                })
        })
    }

    getUsersStats() {
        return new Promise((resolve, reject) => {
            this.getUsers()
                .then(users => {
                    if (!users || (users && !users.length)) {
                        reject(new Error(`Invalid Slack response.`))
                    }

                    // remove slackbot and bots from users
                    // slackbot is not a bot, go figure!
                    users = users.filter(x => {
                        return x.id != 'USLACKBOT' && !x.is_bot && !x.deleted
                    })

                    let total = users.length
                    let active = users.filter(user => {
                        return 'active' === user.presence
                    }).length

                    resolve({ total, active })
                })
                .catch(reject)
        })
    }

    sendMessage({ username, channel, text, icon }) {
        return new Promise((resolve, reject) => {
            request
                .post(
                    `https://${this.subdomain}.slack.com/api/chat.postMessage`,
                )
                .type('form')
                .send({
                    channel,
                    text,
                    username,
                    token: this.token,
                    icon_emoji: icon,
                })
                .end(function(err) {
                    if (err) return reject(err)
                    resolve()
                })
        })
    }
}
