/**
 * @prettier
 */

"use strict"

const axios = require("axios")

const genreMapper = require("./src/utilities/genre-mapper")

async function main() {
	try {
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
			return response.data.results.map(function (movie) {
				return {
					...movie,
					genre: genreMapper(movie.genre_ids),
				}
			})
		})
	} catch (error) {
		console.log(error)
	}
}

main()
