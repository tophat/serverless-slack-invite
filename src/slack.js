import request from 'superagent'

export default class Slack {

  constructor ({ token, interval, subdomain }){
    this.subdomain = subdomain
    this.token = token
    this.org = {}
    this.users = {}
    this.channelsByName = {}
  }


  invite(email, channel) {
    return new Promise((resolve, reject) => {
      let data = { email, token: this.token }

      if (channel) {
        data.channels = channel
        data.ultra_restricted = 1
        data.set_active = true
      }

      request
      .post(`https://${this.subdomain}.slack.com/api/users.admin.invite`)
      .type('form')
      .send(data)
      .end(function (err, res){
        if (err) return reject(err)
        if (200 != res.status) {
          reject(new Error(`Invalid response ${res.status}.`))
          return
        }

        // If the account that owns the token is not admin, Slack will oddly
        // return `200 OK`, and provide other information in the body. So we
        // need to check for the correct account scope and call the callback
        // with an error if it's not high enough.
        let {ok, error: providedError, needed} = res.body
        if (!ok) {
          if (providedError === 'missing_scope' && needed === 'admin') {
            reject(new Error(`Missing admin scope: The token you provided is for an account that is not an admin. You must provide a token from an admin account in order to invite users through the Slack API.`))
          } else if (providedError === 'already_invited') {
            reject(new Error('You have already been invited to Slack. Check for an email from feedback@slack.com.'))
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
}
