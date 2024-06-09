/**
 * @prettier
 */

"use strict"

const express = require("express")

const movieRecommendationRoute = require("./movie-recommendation")

const router = express.Router()

router.use("/movie-recommendation", movieRecommendationRoute)

module.exports = router
