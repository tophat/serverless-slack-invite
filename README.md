# serverless-slack-invite

[![Builds](https://img.shields.io/circleci/project/github/tophat/serverless-slack-invite.svg)](https://circleci.com/gh/tophat/serverless-slack-invite)
[![Slack workspace](https://slackinvite.dev.tophat.com/badge.svg)](https://opensource.tophat.com/slack)
[![Maturity badge - level 2](https://img.shields.io/badge/Maturity-Level%202%20--%20First%20Release-yellowgreen.svg)](https://github.com/tophat/getting-started/blob/master/scorecard.md)
[![Greenkeeper badge](https://badges.greenkeeper.io/tophat/serverless-slack-invite.svg)](https://greenkeeper.io/)

A serverless service providing badge and invitation gateway for public Slack channels. You'll be able to bring this up on AWS in minutes.

## Installation on Lambda

**Step 1:** Generate AWS access and secret key by creating a user in [AWS IAM](https://console.aws.amazon.com/iam/home) with `AdministratorAccess` permission.

**Step 2:** Generate a Slack token using [this page](https://api.slack.com/custom-integrations/legacy-tokens).

**Step 3:** Set following ENV variables:

- `AWS_ACCESS_KEY_ID`: Your AWS access key generated in Step 1
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key generated in Step 1
- `SLACK_API_TOKEN`: The slack API token generated in Step 2
- `SLACK_SUBDOMAIN`: Your slack subdomain for your workspace `https://<your-subdomain>.slack.com`

**Step 4:** Run following commands:

```sh
yarn install
yarn build
serverless deploy
```

You should be able to pass the ENV variables like this:

```sh
AWS_ACCESS_KEY_ID="abc" AWS_SECRET_ACCESS_KEY="abc" SLACK_API_TOKEN="abc" SLACK_SUBDOMAIN="your-subdomain" serverless deploy
```

It should give you a link to the service!

## Running as standalone Webserver

**Step 1:** Set following ENV variables:

```sh
export SLACK_API_TOKEN='abc'
export SLACK_SUBDOMAIN='your-subdomain'
```

**Step 2:** Install, build and start:

```sh
yarn install
yarn build
yarn start
```

## Endpoints

**`GET /badge.svg`**

Displays an SVG badge with the number of online users and total users in Slack.

You can embed this badge in your Github repo using following snippet:

```md
[![Slack](https://slackinvite.dev.tophat.com/badge.svg)](https://opensource.tophat.com/#join-slack)
```

[![Slack](https://slackinvite.dev.tophat.com/badge.svg)](https://opensource.tophat.com/#join-slack)

----

**`POST /invite`**

By posting `email` to this endpoint, a Slack invitation will be sent from the user who generated the Slack API token.

This enpoint will return `400` if the email is not valid or user is already invited with following JSON as response:

```json
{"success": false, "message": "Error Message" }
```

----

**`GET /stats`**

Returns number of active and total members on Slack in following format:

```json
{"success": true, "stats": {"total": 39, "active": 25}}
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/445636?s=460&v=4" width="100px;"/><br /><sub><b>Siavash Bidgoly</b></sub>](http://github.com/syavash)<br />[💻](https://github.com/tophat/serverless-slack-invite/commits?author=syavash "Code") [📖](https://github.com/tophat/serverless-slack-invite/commits?author=syavash "Documentation") [🚇](#infra-syavash "Infrastructure (Hosting, Build-Tools, etc)") | [<img src="https://avatars2.githubusercontent.com/u/3534236?v=4" width="100px;"/><br /><sub><b>Jake Bolam</b></sub>](https://jakebolam.com)<br />[📖](https://github.com/tophat/serverless-slack-invite/commits?author=jakebolam "Documentation") [🚇](#infra-jakebolam "Infrastructure (Hosting, Build-Tools, etc)") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## Credits

Thanks to [Carol Skelly](https://github.com/iatek) for donating the github organization!
