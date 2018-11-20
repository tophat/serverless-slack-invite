import express from "express";
import { json } from "body-parser";
import { Server as http } from "http";
import remail from "email-regex";
import cors from "cors";
import request from "superagent";

export default function SlackInvite({
  token,
  interval = 5000,
  org,
  gcaptcha_secret,
  gcaptcha_sitekey,
  path = "/",
  server = false,
}) {

  let app = express()

  let assets = __dirname + '/assets'

  app.options('*', cors())
  app.use(cors())

  app.get('/', (req, res) => {
    res.json({success: true})
  })


  return app
}
