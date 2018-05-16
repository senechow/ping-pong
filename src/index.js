import './css/style.css';

var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;

var showingWinScreen = false;
var showPauseScreen = true;

var paddle1Y = 210;
var paddle2Y = 210;
const PADD_HEIGHT = 100;
const PADD_WIDTH = 10;
const PADDLE_X_START = 210;

var aiSpeed = 6;
const EASY_SPEED = 2;
const NORMAL_SPEED = 6;
const HARD_SPEED = 10;
const IMP_SPEED = 14;

const FRAMES_PER_SECOND = 30;

// This means wait for the entire page to load
window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	// This means call the function in 30 frames per second
	setInterval(initializeGame, 1000 / FRAMES_PER_SECOND);

	canvas.addEventListener('mousemove',
		function(event) {
			var mousePos = calculateMousePos(event);
			paddle1Y = mousePos - (PADD_HEIGHT / 2);
	});

	canvas.addEventListener('mousedown', handleMouseClick);

	buttonEvents();
}

function initializeGame() {
	ballMovement();
	drawGame();
}

function drawGame() {
	// Game space
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	if(showingWinScreen) {

		canvasContext.fillStyle = 'white';

		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText('You won!', 350, 100);
		} else if(player2Score >= WINNING_SCORE) {
			canvasContext.fillText('You lost!', 350, 100);
		}

		canvasContext.fillText('Click to play again.', 350, 500);

		return;
	}

	if(showPauseScreen) {
		canvasContext.fillStyle = 'white';
		canvasContext.fillText('Click to play.', 350, 300);
		return;
	} 

	drawNet();

	// left player paddle
	colorRect(0, paddle1Y, PADD_WIDTH, PADD_HEIGHT, 'white');

	// right computer paddle
	colorRect(canvas.width - PADD_WIDTH, paddle2Y, PADD_WIDTH, PADD_HEIGHT, 'white');

	// The ball
	// Since ballX is now increasing on each call, the element is moving.
	colorCircle(ballX, ballY, 10, 'white');

	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function ballMovement() {

	if(showingWinScreen || showPauseScreen) {
		return;
	} 

	computerMovement();

	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX < 0) {
		if(ballY > paddle1Y && ballY < paddle1Y + PADD_HEIGHT) {
			ballHitsPaddle(paddle1Y);
		} else {
			player2Score++;
			ballReset();
		}
	}

	if(ballX > canvas.width) {
		if(ballY > paddle2Y && ballY < paddle2Y + PADD_HEIGHT) {
			ballHitsPaddle(paddle2Y);
		} else {
			player1Score++;
			ballReset();
		}
	}

	if(ballY > canvas.height || ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
}

function ballHitsPaddle(paddle) {
	ballSpeedX = -ballSpeedX;
	var deltaY = ballY - (paddle + PADD_HEIGHT/2);
	ballSpeedY = deltaY * 0.35;
}

function drawNet() {
	for(var i = 0; i < canvas.height; i += 40) {
		colorRect((canvas.width / 2) - 1, i, 2, 20, 'white');
	}
}

function handleMouseClick() {
	if(showingWinScreen) {
		resetGame();
	}
	if(showPauseScreen) {
		showPauseScreen = false;
	}
}

function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADD_HEIGHT / 2);
	// We add/subtract 35 and keep it still on the occasion to prevent jitter
	if(paddle2YCenter < ballY - 35) {
		paddle2Y += aiSpeed;
	} else if(paddle2YCenter > ballY + 35){
		paddle2Y -= aiSpeed;
	}

}

function colorRect(leftX, topY, width, height, drawColor) {
	// First 2 arguments is the starting position of the fill
	// Next 2 arguments are the width and height of how much to fill
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
	// For a canvas, the last defined elements overlap the previous ones
}

function colorCircle(centerX, centerY, radius, color) {
	
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	// First 2 args is X and Y position, 3rd arg is radius
	// The 4th and 5th are the start and end angle in radians
	// The final argument is clockwise if true else counter clockwise
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();

}

function calculateMousePos(event) {

	// Gets the canvas black box bounding area.
	var rect = canvas.getBoundingClientRect();
	// Get the document information
	// evt.clientX and evt.clientY are the mouse position of the client
	// We are accounting where the mouse is from the canvas and how far we scrolled
	// The top coord will always be 0x0 and the bottom is 800x600;
	var mouseY = event.clientY - rect.top;
	return mouseY;

}

function ballReset() {

	if(player1Score >= WINNING_SCORE ||
		player2Score >= WINNING_SCORE) {
		showingWinScreen = true;				
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
}

function buttonEvents() {
	setDifficulty("btnEasy", EASY_SPEED, 'Easy');
	setDifficulty("btnNormal", NORMAL_SPEED, 'Normal');
	setDifficulty("btnHard", HARD_SPEED, 'Hard');
	setDifficulty("btnImp", IMP_SPEED, 'Impossible');
}

function setDifficulty(id, speed, difficulty) {
	var btn = document.getElementById(id);
	btn.addEventListener('click', function() {
		setDifficultyEvent(speed);
		var diffTextEl = document.getElementById('difficultySelected');
		diffTextEl.textContent = difficulty + ' Difficulty Selected';
	});
}

function setDifficultyEvent(speed) {
	aiSpeed = speed;
	resetGame();
}

function resetGame() {
	ballReset();
	player1Score = 0;
	player2Score = 0;
	paddle1Y = PADDLE_X_START;
	paddle2Y = PADDLE_X_START;
	showingWinScreen = false;
}
