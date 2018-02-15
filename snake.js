// Declare Local Variables

export const COLS = 100;
export const ROWS = 100;
export const GAP_SIZE = 1;
export const CELL_SIZE = 10;
export const CANVAS_WIDTH = COLS * (CELL_SIZE + GAP_SIZE);
export const CANVAS_HEIGHT ROWS * (CELL_SIZE + GAP_SIZE);

// Declare Global canvas functions

export function createCanvasElement() {
	const canvas = document.createElement('canvas');
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	return canvas;
}

// Initialize canvas

let canvas = createCanvasElement();
let ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// Define observable streams

let keydown$ = Observable.fromEvent(document, 'keydown');

// Define interfaces for game stream

export interface Point2D {
	x: number;
	y: number;
}

export interface Directions {
	[key: number]: Point2D;
}

export const DIRECTIONS: Directions = {
	37: { x: -1, y: 0 }, // Left Arrow
	39: { x: 1, y: 0 }, // Right Arrow
	38: { x: 0, y: -1 }, // Up Arrow
	40: { x: 0, y: 1 }, // Down Arrow
};

// Extend observable chain

let directions$ = keydown$
	.map((event: KeyboardEvent) => DIRECTIONS[event.keyCode])
	.filter(direction => !!direction)
	.scan(nextDirection)
	.startwith(INITIAL_DIRECTION)
	.distinctUntilChanged();

// Handler for navigation

export function nextDirection(previous, next) {
	let isOpposite = (previous: Point2D, next: Point2D) => {
		return next.x === previous.x * -1 || next.y === previous.y * -1;
	};

	if (isOpposite(previous, next)) {
		return previous;
	}

	return next;
}

// Define behaviour subject

// SNAKE_LENGTH specifies the intial length of our SNAKE_LENGTH
let length$ = new BehaviorSubject<number>(SNAKE_LENGTH);

let snakeLength$ = length$
	.scan((step, snakeLength) => snakeLength + step)
	.share();
