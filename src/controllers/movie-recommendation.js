/**
 * @prettier
 */

const axios = require("axios")

const genreMapper = require("../utilities/genre-mapper")
const validatorjs = require("../utilities/validatorjs")

module.exports = {
	getMovieRecomendations: async function (request, response, next) {
		try {
			let requestInputs = await validatorjs(
				{
					genres: request.query.genres,
				},
				{
					genres: "string",
				}
			)

			const likedGenres = requestInputs.genres.split(",").map(function (genre) {
				const splitted = genre.split(":")
				return {
					name: splitted[0],
					percentage: parseInt(splitted[1]),
				}
			})

			const movies = await axios({
				url: "https://api.themoviedb.org/3/movie/popular",
				method: "get",
				headers: {
					"content-type": "application/json",
					authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWIwN2Q1YzJhMDc2M2FkMjU5ZDY2NmRiNmQ1MDk3MiIsInN1YiI6IjY2NjU1NzM5ZTQ2MjY3OGY3ZTEzODA1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N3--_ntJ3Z351IaHB0hWljSgvIt7B4jmOBJxQrEVpmQ`,
				},
				params: {
					language: "en-US",
					page: 1,
				},
			}).then(function (response) {
				return response.data.results
					.map(function (movie) {
						return {
							...movie,
							genre: genreMapper(movie.genre_ids),
						}
					})
					.filter(function (movie) {
						let genreLiked = false

						for (let a = 0; a < likedGenres.length; a++) {
							if (movie.genre.indexOf(likedGenres[a].name) >= 0) {
								genreLiked = true
								break
							}
						}

						return genreLiked
					})
			})

			return response.status(200).send(
				movies.map(function (movie) {
					return {
						poster: movie.poster_path,
						title: movie.original_title,
					}
				})
			)
		} catch (error) {
			console.log(error)
		}
	},
}
