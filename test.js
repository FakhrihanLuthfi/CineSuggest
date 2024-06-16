/**
 * @prettier
 */

"use strict"

const path = require("path")
const tfjs = require("@tensorflow/tfjs-node")

const wordIndex = require("./src/constants/word-index")

const overview = "They are the best-kept secret in the universe. Working for a highly funded yet unofficial government agency, Kay (Tommy Lee Jones) and Jay (Will Smith) are the Men in Black, providers of immigration services and regulators of all things alien on Earth. While investigating a series of unregistered close encounters, the MIB agents uncover the deadly plot of an intergalactic terrorist who is on a mission to assassinate two ambassadors from opposing galaxies currently in residence in New York City."

const foundedWordIndex = overview
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

async function main() {
	const model = await tfjs.loadLayersModel(`file://${path.join(__dirname, "./model/overview/model.json")}`)

	const inputData = tfjs.tensor2d(tokenized, [1, 100])

	const predictionResults = model.predict(inputData)

	console.log(await predictionResults.data())
}

main()
