import { SnakeParticle } from "./SnakeParticle";

class Snake {
	public array: SnakeParticle[] = []

	constructor() {
	}

	addParticle(snakeParticle) {
		this.array.push(snakeParticle)
	}
}

export { Snake }
