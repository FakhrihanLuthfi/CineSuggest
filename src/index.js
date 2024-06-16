/**
 * @prettier
 */

"use strict"

const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") })
const express = require("express")

const router = require("./routes/router")

const application = express()

application.use(express.json())

application.use(router)

application.listen(process.env.PORT)
