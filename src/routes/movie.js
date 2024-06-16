/**
 * @prettier
 */

"use strict"

const express = require("express")

const movieController = require("../controllers/movie")

const router = express.Router()

router.get("/search", movieController.searchMovies)
router.get("/popular", movieController.getPopularMovie)
router.get("/recommendations", movieController.getMovieRecomendations)
router.get("/prediction", movieController.getMoviePrediction)

module.exports = router
