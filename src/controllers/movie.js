/**
 * @prettier
 */

const axios = require("axios")
const path = require("path")
const tfjs = require("@tensorflow/tfjs-node")

const knownGenres = require("../constants/known-genres")
const wordIndex = require("../constants/word-index")

const genreMapper = require("../utilities/genre-mapper")
const validatorjs = require("../utilities/validatorjs")

module.exports = {
	searchMovies: async function (request, response, next) {
		try {
			let requestInputs = await validatorjs(
				{
					title: request.query.title,
				},
				{
					title: "required|string",
				}
			)

			const movies = await axios({
				url: `${process.env.TMDB_API_BASE_URL}/search/movie`,
				method: "get",
				headers: {
					"content-type": "application/json",
					authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
				},
				params: {
					query: requestInputs.title,
					language: "en-US",
					page: 1,
				},
			}).then(function (response) {
				return response.data.results.map(function (movie) {
					return {
						id: movie.id,
						poster: movie.poster_path,
						title: movie.original_title,
					}
				})
			})

			return response.status(200).send(movies)
		} catch (error) {
			return next(error)
		}
	},

	getPopularMovie: async function (request, response, next) {
		try {
			const popularMovie = await axios({
				url: `${process.env.TMDB_API_BASE_URL}/movie/popular`,
				method: "get",
				headers: {
					"content-type": "application/json",
					authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
				},
				params: {
					language: "en-US",
					page: 1,
				},
			}).then(function (response) {
				const movie = response.data.results[Math.floor(Math.random() * (response.data.results.length - 1 + 1)) + 0]

				return {
					id: movie.id,
					poster: movie.poster_path,
					title: movie.original_title,
				}
			})

			return response.status(200).send(popularMovie)
		} catch (error) {
			return next(error)
		}
	},

	getMovieRecomendations: async function (request, response, next) {
		try {
			let requestInputs = await validatorjs(
				{
					genres: request.query.genres,
					mood: request.query.mood,
				},
				{
					genres: "string",
					mood: "string",
				}
			)

			const likedGenres = requestInputs.genres.split(",")

			const inputArray = new Array(19).fill(0)

			for (let a = 0; a < likedGenres.length; a++) {
				inputArray[knownGenres.indexOf(likedGenres[a])] = 1
			}

			const model = await tfjs.loadLayersModel(`file://${path.join(__dirname, "../../model/genre/model.json")}`)

			const inputTensor = tfjs.tensor(inputArray)
			const reshapedInput = inputTensor.reshape([1, 19])

			const predictionResults = await model
				.predict(reshapedInput)
				.data()
				.then(function (result) {
					return knownGenres.filter(function (knownGenre, index) {
						return parseInt(result[index]) < 1
					})
				})

			const movies = await axios({
				url: `${process.env.TMDB_API_BASE_URL}/movie/popular`,
				method: "get",
				headers: {
					"content-type": "application/json",
					authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
				},
				params: {
					language: "en-US",
					page: 1,
				},
			}).then(function (response) {
				return response.data.results
					.filter(function (movie) {
						const movieGenres = genreMapper(movie.genre_ids)
						const predictionResultsSet = new Set(predictionResults)

						return movieGenres.some((value) => predictionResultsSet.has(value))
					})
					.map(function (movie) {
						return {
							movieId: movie.id,
							poster: movie.poster_path,
							title: movie.original_title,
						}
					})
			})

			return response.status(200).send(movies)
		} catch (error) {
			return next(error)
		}
	},

	getMoviePrediction: async function (request, response, next) {
		try {
			const requestInputs = await validatorjs(
				{
					movieId: request.query.movieId,
				},
				{
					movieId: "required|string",
				}
			)

			const movieOverview = await axios({
				url: `${process.env.TMDB_API_BASE_URL}/movie/${requestInputs.movieId}`,
				method: "get",
				headers: {
					"content-type": "application/json",
					authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
				},
				params: {
					language: "en-US",
				},
			}).then(function (response) {
				return response.data.overview
			})

			const foundedWordIndex = movieOverview
				.split(" ")
				.slice(0, 100)
				.map(function (word) {
					const index = wordIndex[word.toLowerCase()]
					return index != undefined ? index : 0
				})
				.filter(function (index) {
					return index != 0
				})

			const baseToken = new Array(100 - foundedWordIndex.length).fill(0)

			const tokenized = baseToken.concat(foundedWordIndex)

			const model = await tfjs.loadLayersModel(`file://${path.join(__dirname, "../../model/overview/model.json")}`)

			const inputData = tfjs.tensor2d(tokenized, [1, 100])

			const predictionResults = await model.predict(inputData).data()

			let currentHighest
			let currentHighestIndex

			for (let a = 0; a < predictionResults.length; a++) {
				if (currentHighest == undefined || currentHighest < predictionResults[a]) {
					currentHighest = predictionResults[a]
					currentHighestIndex = a
				}
			}

			return response.status(200).send({
				likeProbability: currentHighestIndex + 1,
			})
		} catch (error) {
			return next(error)
		}
	},
}
