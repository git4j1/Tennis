var canvas;
var canvasContext;

var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var sun = new Image();
var earth = new Image();
var jack = new Image();

var player1Score = 0;
var player2Score = 0;

var paddle1Y = 250;
var paddle2Y = 250;

var showingWinScreen = false;

const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
const WINNING_SCORE = 3;

function init() {
    // sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
    earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
    jack.src = 'images/Jack.png';
}

function drawNet() {
    for(var i=0;i<canvas.height; i+=40) {
        colorRect(canvas.width/2-1, i, 2, 20, 'white');
    }
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
           showingWinScreen = true;
       }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function colorRect(leftX,topY, width,height, drawColor) {
    // Canvas and Paddle
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    // Ball
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if (paddle2YCenter < ballY-35) {
        paddle2Y += 6;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 6;
    }
}

function moveEverything() {
    if (showingWinScreen) {
        return;
    }
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0) {
        if (ballY > paddle1Y &&
        ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY
                    -(paddle1Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score++; //must be BEFORE ballReset()
            ballReset();
        }

    }

    if (ballX > canvas.width) {
        if (ballY > paddle2Y &&
        ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY
                    -(paddle2Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player1Score++; //must be BEFORE ballReset()
            ballReset();
        }
    }

    if (ballY < 0) {
            ballSpeedY = -ballSpeedY;
    }

    if (ballY > canvas.height) {
            ballSpeedY = -ballSpeedY;
    }
}

function drawEverything() {
    // Canvas Background
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if (showingWinScreen) {
        canvasContext.fillStyle = 'white';

        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Left Player Won!", 350, 200);
        } else if (player2Score >= WINNING_SCORE) {
            canvasContext.fillText("Right Player Won!", 350, 200);
        }

        canvasContext.fillText("click to continue", 350, 500);
        return;
    }

    // Centerline "Net"
    drawNet();

    // Left Paddle
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

     // Computer Paddle
    colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

    // Ball
    // colorCircle(ballX, ballY, 10, 'white');
    canvasContext.drawImage(earth, ballX, ballY);
    //canvasContext.drawImage(jack, ballX, ballY, 80, 80); // Scale image size

    // Scores
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width-100, 100);
}

// Initialization
init();

window.onload = function() {
    console.log("Hello World");
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.font = "30px Arial";

    var framesPerSecond = 30;

    setInterval(
        function() {
        moveEverything();
        drawEverything();
        },
        1000/framesPerSecond);

        canvas.addEventListener('mousedown', handleMouseClick);
        canvas.addEventListener('mousemove',
                        function(evt) {
                            var mousePos = calculateMousePos(evt);
                            paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
                    });
}