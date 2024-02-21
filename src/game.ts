//Imports
import { CollisionType, Color, Engine, vec, KeyEvent, Actor, Keys, Vector, Font, FontUnit, Label, CollisionStartEvent, CollisionEndEvent, Collider, Side, CollisionContact } from 'excalibur';

// Start game
const game = new Engine({
	width: 800,
	height: 600,
});

game.start();

// Create a Snake object to hold all the SnakeParticle objects
const snake: Actor[] = []

// Function to add a new particle to the snake
function addSnakeParticle(x: number, y: number) {
	const newSnakeParticle = new Actor({
		x: x,
		y: y,
		width: 10,
		height: 10,
		color: Color.Green
	});
	snake.push(newSnakeParticle);
	game.add(newSnakeParticle);
	// No inherent behaviour on collision for snake particles
	newSnakeParticle.body.collisionType = CollisionType.Passive;
	return newSnakeParticle
}

// Starting array of snake particles
for (let i = 0; i < 6; i++) {
	const x = 400 - i * 10;
	const y = 300;
	addSnakeParticle(x, y);
}

// Only allow the snake head to have collision effects when touching food
snake[0].body.collisionType = CollisionType.Passive

// Set the snake head's movement vector
let snakeHeadVector = vec(200, 0);

snake.forEach((particle) => {
	particle.vel = snakeHeadVector
})

// Snake boundary collision behaviour
snake.forEach((particle) => {
	particle.on("postupdate", () => {
		// If the particle collides with the left
		// of the screen, reappear at the right
		if (particle.pos.x + particle.width / 2 < 0) {
			particle.pos.x = game.drawWidth + particle.width / 2;
		}

		// If the particle collides with the right
		// of the screen, reappear on the left
		if (particle.pos.x - particle.width / 2 > game.drawWidth) {
			particle.pos.x = -particle.width / 2;
		}

		// If the particle collides with the top
		// of the screen, reappear at the bottom
		if (particle.pos.y + particle.height / 2 < 0) {
			particle.pos.y = game.drawHeight + particle.height / 2;
		}

		// If the particle collides with the bottom
		// of the screen, reappear at the top
		if (particle.pos.y - particle.height / 2 > game.drawHeight) {
			particle.pos.y = -particle.height / 2;
		}
	});
});

// Store all turn points
const turnArray: Turn[] = []

// Options for creating an instance of the Turn Class  - note velocity != vel
interface TurnOptions {
	x: number,
	y: number,
	velocity: Vector,
	width: number,
	height: number,
	color: Color
}

// Actor extension to add velocity property without moving the turn actor
class Turn extends Actor {
	public velocity: Vector;

	constructor(options: TurnOptions) {
		super(options);
		this.velocity = options.velocity;
	}
}

function createTurn(position, velocity) {
	const turn = new Turn({
		x: position.x,
		y: position.y,
		velocity: velocity,
		width: 10,
		height: 10,
		color: Color.Yellow
	})

	game.add(turn)
	turn.body.collisionType = CollisionType.Passive;
	turnArray.push(turn)
}

for (let i = 0; i < turnArray.length; i++) {
	turnArray[0].on("collisionstart", () => {
	}
	}

// Snake controls
game.input.keyboard.on("press", (event: KeyEvent) => {
	// Position at key press
	const position = snake[0].pos;
	// Snake head velocity stored so we in block can control it below
	let snakeHeadVector = snake[0].vel;

	// Turn object should be placed 1 particle's length ahead of position in original vector
	const turnPosition = {
		x: position.x + snakeHeadVector.x * 10 / 200,
		y: position.y + snakeHeadVector.y * 10 / 200
	};

	// Only allow a 90 degree rotation
	if (event.key == Keys.ArrowDown && snakeHeadVector.y !== -200) {
		snakeHeadVector = vec(0, 200);
	}
	if (event.key == Keys.ArrowUp && snakeHeadVector.y !== 200) {
		snakeHeadVector = vec(0, -200);
	}
	if (event.key == Keys.ArrowLeft && snakeHeadVector.x !== 200) {
		snakeHeadVector = vec(-200, 0);
	}
	if (event.key == Keys.ArrowRight && snakeHeadVector.x !== -200) {
		snakeHeadVector = vec(200, 0);
	}

	// Change velocity
	snake[0].vel = snakeHeadVector;

	// Create a Turn instance if a change in direction occurs
	if (!snake[0].oldVel.equals(snakeHeadVector)) {
		createTurn(turnPosition, snakeHeadVector);
	}
});

// Food for the snake with random position
function getRandomPosition(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

const foodArray: Actor[] = []

function createFood() {
	const food = new Actor({
		x: getRandomPosition(1, 800),
		y: getRandomPosition(1, 600),
		width: 10,
		height: 10,
		color: Color.Magenta
	});

	game.add(food);
	// No inherent behavour for food
	food.body.collisionType = CollisionType.Passive;
	return food
}

// Create starting food
const food = createFood()
foodArray.push(food)

// Display quantity of food eaten
const scoreCounter = new Label({
	text: (foodArray.length - 1).toString(),
	pos: vec(750, 55),
	font: new Font({
		family: 'calibri',
		size: 3,
		unit: FontUnit.Em,
		color: Color.White
	})
});

game.add(scoreCounter)

// Needed for knowing where to add new particles
// Fix for new vector process
function getDirection() {
	if (snakeHeadVector == vec(0, 200)) {
		return "down";
	} else if (snakeHeadVector = vec(0, -200)) {
		return "up";
	} else if (snakeHeadVector = vec(-200, 0)) {
		return "left";
	} else if (snakeHeadVector = vec(200, 0)) {
		return "right";
	} else {
		return "none";
	}
}

// // Snake eating food behaviour (add particle, new food, update score)
// snake[0].on("collisionstart", () => {
// 	const direction = getDirection()
// 	let x, y;
// 	if (direction === "down") {
// 		x = snake[snake.length - 1].pos.x
// 		y = snake[snake.length - 1].pos.y - 10
// 	}
// 	if (direction === "up") {
// 		x = snake[snake.length - 1].pos.x
// 		y = snake[snake.length - 1].pos.y - 10
// 	}
// 	if (direction === "left") {
// 		x = snake[snake.length - 1].pos.x - 10
// 		y = snake[snake.length - 1].pos.y
// 	}
// 	if (direction === "right") {
// 		x = snake[snake.length - 1].pos.x - 10
// 		y = snake[snake.length - 1].pos.y
// 	}
// 	const newSnakeParticle = addSnakeParticle(x, y);
// 	newSnakeParticle.vel = snake[snake.length - 1].vel
// 	newSnakeParticle.body.collisionType = CollisionType.PreventCollision
// 	foodArray.forEach((food) => {
// 		food.kill()
// 	})
// 	const food = createFood()
// 	foodArray.push(food)
// 	scoreCounter.text = (foodArray.length - 1).toString();
// })


// Loss condition
// snake[0].on('collisionend', (event: CollisionEndEvent) => {
// 	if (snake.includes(event.other) && event.other != snake[0]) {
// 		alert('You lose')
// 	}
// })
