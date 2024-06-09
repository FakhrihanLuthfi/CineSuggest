/**
 * @prettier
 */

"use strict"

const express = require("express")

const movieRecommendationController = require("../controllers/movie-recommendation")

const router = express.Router()

router.get("/", movieRecommendationController.getMovieRecomendations)

module.exports = router
