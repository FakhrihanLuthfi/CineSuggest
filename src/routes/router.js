/**
 * @prettier
 */

"use strict"

const express = require("express")

const movieRoute = require("./movie")

const router = express.Router()

router.use("/movie", movieRoute)

router.use(function (error, request, response, next) {
	console.log(error)

	return response.status(error.httpStatusCode || 500).send(error.responseBody || { code: "internal-server-error" })
})

module.exports = router
