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

//PLUSS PÅ 70 HUSK 
const blocks = [
    new Block(5, 270),
    new Block(60, 270),
    new Block(115, 270),
    new Block(170, 270),
    new Block(225, 270),
    new Block(280, 270),
    new Block(335, 270),
    new Block(390, 270),
    new Block(445, 270),
    new Block(500, 270),

    new Block(5, 240),
    new Block(60, 240),
    new Block(115, 240),
    new Block(170, 240),
    new Block(225, 240),
    new Block(280, 240),
    new Block(335, 240),
    new Block(390, 240),
    new Block(445, 240),
    new Block(500, 240),

    new Block(5, 210),
    new Block(60, 210),
    new Block(115, 210),
    new Block(170, 210),
    new Block(225, 210),
    new Block(280, 210),
    new Block(335, 210),
    new Block(390, 210),
    new Block(445, 210),
    new Block(500, 210),

    new Block(5, 180),
    new Block(60, 180),
    new Block(115, 180),
    new Block(170, 180),
    new Block(225, 180),
    new Block(280, 180),
    new Block(335, 180),
    new Block(390, 180),
    new Block(445, 180),
    new Block(500, 180)
];

// Legge til blokker
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

// Legg til bruker
const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);

//bruker
function drawUser() {
    user.style.left = userCurrentPosition[0] + 'px';
    user.style.bottom = userCurrentPosition[1] + 'px';
}

// ball 
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// Flytte brukeren
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

// Legge til ballen
const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

// Flytte ballen
function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForBlockCollision();
    checkForUserCollision();
    checkForCollisions(); 
}

// Sjekk om den treffer noen av blokkene
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

// Sjekk om den treffer brukeren sin block
function checkForUserCollision() {
    if (
        (ballCurrentPosition[0] > userCurrentPosition[0] && ballCurrentPosition[0] < userCurrentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > userCurrentPosition[1] && ballCurrentPosition[1] < userCurrentPosition[1] + blockHeight)
    ) {
        console.log('Kollisjon med bruker');
        yDirection = 2;
    }
}

// 
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
//Starter spillet
function startGame (){
    moveBall();
    timerId = setInterval(moveBall, 15); 
}