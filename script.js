const gameContainer = document.querySelector('.game-container');
const target = document.querySelector('.target');
const infoDisplay = document.querySelector('.display');
const timerDisplay = document.querySelector('.timer');
const scoreDisplay = document.querySelector('.score');
const gameOverPopup = document.querySelector('.game-over-popup');
const restartButton = document.getElementById('restart-button');

let targetMoving = false;
const targetAnimationLength = 200;

let score = 0;
const initialTime = 10;
let timer = initialTime;
let gameInterval;
let isGameRunning = false;

hideGameOverPopup();
onResize();
target.addEventListener('click', startGame);
addEventListener("resize", onResize);
restartButton.addEventListener('click', () => {
    hideGameOverPopup();
    restartGame();
});

function onResize() {
    gameContainer.style.width = window.innerWidth + "px";
    gameContainer.style.top = 150 + "px";
    const height = window.innerHeight - parseInt(gameContainer.style.top, 10);
    gameContainer.style.height = height + "px";
}

function intersectsInfoDisplay(left, top, width, height) {
    const infoRect = infoDisplay.getBoundingClientRect();
    const right = left + width; // Calculate the right edge
    const bottom = top + height; // Calculate the bottom edge
    return (
        left < infoRect.right &&
        right > infoRect.left &&
        top < infoRect.bottom &&
        bottom > infoRect.top
    );
}

function getRandomPos() {
    const gameContainerRect = gameContainer.getBoundingClientRect();
    const maxX = gameContainerRect.width - target.clientWidth;
    const maxY = gameContainerRect.height - target.clientHeight;

    // Calculate the maximum allowable X and Y coordinates to stay within bounds
    const maxXAllowed = Math.max(maxX, 0); // Ensure it's not negative
    const maxYAllowed = Math.max(maxY, 0); // Ensure it's not negative

    // Generate random X and Y coordinates within the allowed bounds
    let randX = Math.random() * maxXAllowed;
    let randY = Math.random() * maxYAllowed;

    // Ensure the pos isn't under the info display
    while (intersectsInfoDisplay(randX, randY, 100, 100)) {
        randX = Math.random() * maxXAllowed;
        randY = Math.random() * maxYAllowed;
    }

    return {
        x: randX,
        y: randY
    };
}

function updateTimer() {
    timerDisplay.textContent = `Time ${timer}s`;

    if (timer === 0) {
        endGame(true);
    } else {
        timer--;
    }
}

function moveTarget() {
    if (!targetMoving) {
        const pos = getRandomPos();
        // Generate random duration values between min and max
        const min = 100;
        const max = 300;
        const randomDurationLeft = Math.floor(Math.random() * (max - min + 1) + min);
        const randomDurationTop = Math.floor(Math.random() * (max - min + 1) + min);

        // Apply the random duration values to the CSS transition property
        target.style.transition = `left ${randomDurationLeft}ms ease, top ${randomDurationTop}ms ease`;

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
        hideGameOverPopup();
        gameContainer.classList.add('running');
        score = 0;
        timer = initialTime; // Reset the timer
        scoreDisplay.textContent = 'Paps ~';
        target.textContent = '';
        target.style.display = 'block';
        target.style.left = '50%';
        target.style.top = '50%';
        gameInterval = setInterval(updateTimer, 1000);
        target.addEventListener('click', incrementScore);
        moveTarget();
    }
}

function restartGame() {
    endGame(false);
    target.style.display = 'block';
    target.style.left = '50%';
    target.style.top = '50%';
}

function endGame(showPopup) {
    gameContainer.classList.remove('running');
    clearInterval(gameInterval);
    target.removeEventListener('click', incrementScore);
    target.style.display = 'none';
    if (showPopup) {
        showGameOverPopup();
    }
    isGameRunning = false;
}

function incrementScore() {
    score++;
    scoreDisplay.textContent = `Paps ${score}`;
    moveTarget();
}

function showGameOverPopup() {
    gameOverPopup.style.display = 'block';
}

function hideGameOverPopup() {
    gameOverPopup.style.display = 'none';
}