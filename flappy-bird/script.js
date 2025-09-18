const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = { x: 50, y: 300, width: 30, height: 30, dy: 0, gravity: 0.6, jump: -10 };
const pipes = [];
const pipeGap = 150;
let frame = 0;
let score = 0;
const highScoreKey = 'flappyHighScore';
let highScore = localStorage.getItem(highScoreKey) || 0;

const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const gameOverEl = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');

highScoreEl.innerText = highScore;

function spawnPipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({ x: canvas.width, y: 0, width: 50, height: topHeight });
    pipes.push({ x: canvas.width, y: topHeight + pipeGap, width: 50, height: canvas.height - topHeight - pipeGap });
}

function update() {
    bird.dy += bird.gravity;
    bird.y += bird.dy;

    if (bird.y + bird.height > canvas.height) gameOver();

    frame++;
    if (frame % 90 === 0) spawnPipe();

    pipes.forEach(pipe => {
        pipe.x -= 3;
        if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height && bird.y + bird.height > pipe.y) gameOver();
        if (pipe.x + pipe.width === bird.x) score++;
    });

    pipes.filter(pipe => pipe.x + pipe.width > 0);
    scoreEl.innerText = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem(highScoreKey, highScore);
        highScoreEl.innerText = highScore;
    }
}

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0f0";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = "#0f0";
    pipes.forEach(pipe => ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height));
}

function gameLoop() {
    if (!gameOverEl.classList.contains('hidden')) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function jump() {
    bird.dy = bird.jump;
}

// sterowanie PC
document.addEventListener('keydown', e => {
    if (e.key === " ") jump();
});

// sterowanie mobilne
canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    jump();
});

// restart
restartBtn.addEventListener('click', () => {
    pipes.length = 0;
    bird.y = 300;
    bird.dy = 0;
    score = 0;
    scoreEl.innerText = score;
    gameOverEl.classList.add('hidden');
    gameLoop();
});

function gameOver() {
    gameOverEl.classList.remove('hidden');
}

gameLoop();