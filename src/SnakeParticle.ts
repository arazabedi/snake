import { Actor } from "excalibur";

class SnakeParticle extends Actor {

	constructor(options) {
		super(options)
		this.color = options.color
	}
}

export { SnakeParticle }
