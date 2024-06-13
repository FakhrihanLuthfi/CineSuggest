/**
 * @prettier
 */

"use strict"

require("dotenv").config()
const express = require("express")

const router = require("./src/routes/router")

const application = express()

application.use(express.json())

application.use(router)

application.listen(process.env.PORT)
