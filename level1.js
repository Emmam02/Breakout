const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
let score = 0;
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;
let timerId;
let gameIsRunning = true;
let xDirection = 2;
let yDirection = 2;

const userStart = [230, 10];
let userCurrentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

class Block {
    constructor(x, y) {
        this.bottomLeft = [x, y];
        this.bottomRight = [x + blockWidth, y];
        this.topLeft = [x, y + blockHeight];
        this.topRight = [x + blockWidth, y + blockHeight];
    }
}

const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),

    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),

    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
];

function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        grid.appendChild(block);
    }
}
addBlocks();

// Add user
const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);

// Draw user
function drawUser() {
    user.style.left = userCurrentPosition[0] + 'px';
    user.style.bottom = userCurrentPosition[1] + 'px';
}

// Draw Ball
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// Move user
function moveUser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (userCurrentPosition[0] > 0) {
                userCurrentPosition[0] -= 10;
                drawUser();
            }
            break;

        case 'ArrowRight':
            if (userCurrentPosition[0] < boardWidth - blockWidth) {
                userCurrentPosition[0] += 10;
                drawUser();
            }
            break;
    }
}

document.addEventListener('keydown', moveUser);

// Add ball
const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

// Move Ball
function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForBlockCollision();
    checkForUserCollision();
    checkForCollisions(); // Call checkForCollisions to check for collisions
}

// Check for block collisions
function checkForBlockCollision() {
    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
        ) {
            console.log('Kollisjon med blokk' + i);
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[i].classList.remove('block');
            blocks.splice(i, 1);
            yDirection = -yDirection;
            score++;
            scoreDisplay.innerHTML = 'Score:' + score;

            if (blocks.length == 0) {
                scoreDisplay.innerHTML = 'You Won';
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
            }
        }
    }
}

// Check for user collision
function checkForUserCollision() {
    if (
        (ballCurrentPosition[0] > userCurrentPosition[0] && ballCurrentPosition[0] < userCurrentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > userCurrentPosition[1] && ballCurrentPosition[1] < userCurrentPosition[1] + blockHeight)
    ) {
        console.log('Kollisjon med bruker');
        yDirection = -yDirection;
    }
}

// Check for Collisions
function checkForCollisions() {
    if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= 0) {
        xDirection = -xDirection;
    }

    if (ballCurrentPosition[1] >= (boardHeight - ballDiameter)) {
        yDirection = -yDirection;
    }

    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId);
        scoreDisplay.innerHTML = 'You Lost';
        document.removeEventListener('keydown', moveUser);
    }
}
function startGame (){
    moveBall();
    timerId = setInterval(moveBall, 20); 
}
