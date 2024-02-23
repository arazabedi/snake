import { Color } from "excalibur"

function randomColor() {
	return (
		Color.fromRGB(
			Math.floor(Math.random() * 256),
			Math.floor(Math.random() * 256),
			Math.floor(Math.random() * 256)
		)
	)
}

function randomColor50() {
	return (
		Color.fromRGB(
			Math.round(((Math.floor(Math.random() * 256)) / 50) * 50),
			Math.round(((Math.floor(Math.random() * 256)) / 50) * 50),
			Math.round(((Math.floor(Math.random() * 256)) / 50) * 50)
		)
	)
}

export {randomColor, randomColor50}
