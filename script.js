const target = document.querySelector('.target');
const gameContainer = document.querySelector('.game-container');
const timerDisplay = document.querySelector('.timer');
const scoreDisplay = document.querySelector('.score');

let targetMoving = false;
const targetAnimationLength = 200;

let score = 0;
let timer = 120;
const initialTime = 5;
let gameInterval;
let isGameRunning = false;

function getRandomPos() {
    const maxX = gameContainer.clientWidth - target.clientWidth;
    const maxY = gameContainer.clientHeight - target.clientHeight;

    // Calculate the maximum allowable X and Y coordinates to stay within bounds
    const maxXAllowed = Math.max(maxX, 0); // Ensure it's not negative
    const maxYAllowed = Math.max(maxY, 0); // Ensure it's not negative

    // Calculate the maximum allowable X and Y coordinates considering the info display
    const infoDisplay = document.querySelector('.display');
    const infoRect = infoDisplay.getBoundingClientRect();
    const minXAllowed = infoRect.right; // Ensure it's not left of the info display
    const minYAllowed = infoRect.bottom; // Ensure it's not above the info display

    // Generate random X and Y coordinates within the allowed bounds
    const randX = minXAllowed + Math.random() * (maxXAllowed - minXAllowed);
    const randY = minYAllowed + Math.random() * (maxYAllowed - minYAllowed);

    return {
        x: randX,
        y: randY
    };
}

function updateTimer() {
    timerDisplay.textContent = `Time: ${timer}s`;

    if (timer === 0) {
        endGame();
    } else {
        timer--;
    }
}

function moveTarget() {
    if (!targetMoving) {
        const pos = getRandomPos();
        target.style.left = pos.x + 'px';
        target.style.top = pos.y + 'px';

        // Prevent overlapping animations
        setTimeout(() => {
            targetMoving = false;
        }, targetAnimationLength);
    }
}

function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        gameContainer.classList.add('running');
        score = 0;
        timer = initialTime; // Reset the timer
        scoreDisplay.textContent = 'Paps: ~';
        target.textContent = '';
        target.style.display = 'block';
        target.style.left = '50%';
        target.style.top = '50%';
        gameInterval = setInterval(updateTimer, 1000);
        target.addEventListener('click', incrementScore);
        moveTarget();
    }
}

function endGame() {
    gameContainer.classList.remove('running');
    clearInterval(gameInterval);
    target.removeEventListener('click', incrementScore);
    target.style.display = 'none';
    alert(`Game Over! You papped the bubble ${score} times!`);
    isGameRunning = false;
}

function incrementScore() {
    score++;
    scoreDisplay.textContent = `Paps: ${score}`;
    moveTarget();
}

target.addEventListener('click', startGame);
