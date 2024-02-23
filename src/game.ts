//Imports
import { CollisionType, Color, Engine, vec, KeyEvent, Actor, Keys, Font, FontUnit, Label, CollisionStartEvent, Scene } from 'excalibur';
import { SnakeParticle } from './SnakeParticle';
import { Snake } from './snake';
import { randomColor } from './utils';

// Game Configuration
const game = new Engine({
	width: 800,
	height: 600,
	maxFps: 20
});

// Start the Game
game.start();

// game.goToScene('gameplay')
let gameSpeed = 200

// Create a Snake array to hold all the SnakeParticle objects
const snake = new Snake()

// Function to add a new particle to the snake
function addSnakeParticle(x: number, y: number, color?: Color) {
	const newSnakeParticle = new SnakeParticle({
		x: x,
		y: y,
		width: 10,
		height: 10,
		color: color || randomColor(),
		// color: Color.Green,
		CollisionType: CollisionType.Active
	});
	snake.addParticle(newSnakeParticle);
	game.add(newSnakeParticle);
	return newSnakeParticle
}

// Create snake head with no previousParticle property
const snakeHead = addSnakeParticle(400, 300, Color.White)

// Starting array of snake particles
for (let i = 0; i < 5; i++) {
	const x = 400 - i * 10;
	const y = 300;
	addSnakeParticle(x, y);
}

// Set the snake head's starting movement vector
snakeHead.vel = vec(gameSpeed, 0);

// Set the rest of the snake particle's starting movement vector
for (let i = 1; i < snake.array.length; i++) {
	snake.array[i].vel = snakeHead.vel

}

// Boundary collision behaviour
snake.array.forEach((particle) => {
	particle.on("postupdate", () => {
			if (particle.pos.x + particle.width / 2 < 0) {
					particle.pos.x = game.drawWidth;
			}

			if (particle.pos.x - particle.width / 2 > game.drawWidth) {
					particle.pos.x = 0;
			}

			if (particle.pos.y + particle.height / 2 < 0) {
					particle.pos.y = game.drawHeight;
			}

			if (particle.pos.y - particle.height / 2 > game.drawHeight) {
					particle.pos.y = 0;
			}
	});
});



// Snake moves in a chain-like manner
game.on("postupdate", () => {
	for (let i = 1; i < snake.array.length; i++) {
		const currentParticle = snake.array[i];
		const previousParticle = snake.array[i - 1];

		currentParticle.pos = previousParticle.oldPos
	}
})

// Snake controls
game.input.keyboard.on("press", (event: KeyEvent) => {
	// Snake head velocity at key press
	let snakeHeadVector = snakeHead.vel;
	// Only allow a 90 degree rotation
	if (event.key == Keys.ArrowDown && snakeHeadVector.y !== -gameSpeed) {
		snakeHeadVector = vec(0, gameSpeed);
	}
	if (event.key == Keys.ArrowUp && snakeHeadVector.y !== gameSpeed) {
		snakeHeadVector = vec(0, -gameSpeed);
	}
	if (event.key == Keys.ArrowLeft && snakeHeadVector.x !== gameSpeed) {
		snakeHeadVector = vec(-gameSpeed, 0);
	}
	if (event.key == Keys.ArrowRight && snakeHeadVector.x !== -gameSpeed) {
		snakeHeadVector = vec(gameSpeed, 0);
	}

	// Change velocity
	snakeHead.vel = snakeHeadVector;
});

// Food for the snake with random position
function getRandomPosition(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

// Will store each food created here and use to calculate score
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
	foodArray.push(food)
	return food
}

// Create starting food
createFood()

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

// Snake eating food behaviour (add particle, new food, update score)
snake.array[0].on("collisionstart", (event: CollisionStartEvent) => {
	if (foodArray.includes(event.other)) {
		let x = snake.array[snake.array.length - 1].pos.x
		let y = snake.array[snake.array.length - 1].pos.y

		// How many snake particles to add on consumption of food
		for (let i = 0; i < 3; i++) {
			const newSnakeParticle = addSnakeParticle(x, y);
			newSnakeParticle.vel = snakeHead.vel
		}

		// Remove the eaten food
		foodArray[foodArray.length-1].kill()

		// Add new food and update score
		createFood();
		scoreCounter.text = (foodArray.length - 1).toString();
	}
});

// Loss condition
snake.array[0].on("postupdate", () => {
	for (let i = 2; i < snake.array.length; i++) {
		if (snake.array[0].pos.equals(snake.array[i].pos)) {
			alert("You lose!")
		}
	}
});
