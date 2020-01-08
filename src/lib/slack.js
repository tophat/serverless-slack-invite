import request from 'superagent'

export default class Slack {
    constructor({ token, subdomain }) {
        this.subdomain = subdomain
        this.token = token
    }

    apiUrl(method) {
        return `https://${this.subdomain}.slack.com/api/${method}`
    }

    invite({ email, channel }) {
        return new Promise((resolve, reject) => {
            const data = { email, token: this.token }

            if (channel) {
                data.channels = channel
                data.ultra_restricted = 1
                data.set_active = true
            }

            request
                .post(this.apiUrl('users.admin.invite'))
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
                    const { ok, error: providedError, needed } = res.body
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
                .get(this.apiUrl('users.list'))
                .query({ token: this.token })
                .end((err, res) => {
                    if (err) return reject(err)

                    if (!res.body.members || !res.body.members.length)
                        reject(new Error(`Invalid Slack response.`))

                    resolve(res.body.members)
                })
        })
    }

    getUserPresence(userId) {
        return new Promise((resolve, reject) => {
            request
                .get(this.apiUrl('users.getPresence'))
                .query({ token: this.token, user: userId })
                .end((err, res) => {
                    if (err) return reject(err)
                    resolve(res.body)
                })
        })
    }

    getUsersStats() {
        return new Promise((resolve, reject) => {
            this.getUsers()
                .then(async users => {
                    if (!users || (users && !users.length)) {
                        reject(new Error(`Invalid Slack response.`))
                    }

                    // remove slackbot and bots from users
                    // slackbot is not a bot, go figure!
                    users = users.filter(x => {
                        return x.id != 'USLACKBOT' && !x.is_bot && !x.deleted
                    })

                    const total = users.length
                    const sumArray = arr => arr.reduce((a, b) => a + b, 0)
                    const getActiveUsersTask = Promise.all(
                        users.map(async ({ id }) => {
                            const user = await this.getUserPresence(id)
                            return 'active' === user.presence
                        }),
                    )
                    const active = sumArray(await getActiveUsersTask)

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
