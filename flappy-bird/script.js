const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.4;
const JUMP = -5;
const PIPE_WIDTH = 50;
const PIPE_GAP = 120;

let bird = { x: 50, y: 150, width: 20, height: 20, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

function jump() {
  if (!gameOver) bird.velocity = JUMP;
}

// Sterowanie PC i dotyk
document.addEventListener("keydown", e => { if(e.code === "Space") jump(); });
canvas.addEventListener("click", jump);
canvas.addEventListener("touchstart", jump);

// Tworzenie nowych rur
function spawnPipe() {
  const top = Math.random() * (canvas.height - PIPE_GAP - 40) + 20;
  pipes.push({ x: canvas.width, top: top });
}

// Aktualizacja gry
function update() {
  if (gameOver) return;

  frame++;
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  if (frame % 90 === 0) spawnPipe();

  // Rury i kolizje
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= 2;

    if (bird.x < pipes[i].x + PIPE_WIDTH &&
        bird.x + bird.width > pipes[i].x &&
        (bird.y < pipes[i].top || bird.y + bird.height > pipes[i].top + PIPE_GAP)) {
      endGame();
    }

    if (pipes[i].x + PIPE_WIDTH < 0) {
      pipes.splice(i, 1);
      score++;
    }
  }

  // Sprawdzenie podłogi i sufitu
  if (bird.y + bird.height > canvas.height || bird.y < 0) endGame();

  draw();
  if (!gameOver) requestAnimationFrame(update);
}

// Rysowanie gry
function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bird
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Pipes
  ctx.fillStyle = "green";
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, PIPE_WIDTH, p.top);
    ctx.fillRect(p.x, p.top + PIPE_GAP, PIPE_WIDTH, canvas.height - p.top - PIPE_GAP);
  });

  // Score
  document.getElementById("score").innerText = "Score: " + score;
}

// Funkcja końca gry
function endGame() {
  gameOver = true;
  finalScore.innerText = "Twój wynik: " + score;
  gameOverScreen.classList.remove("hidden");
}

// Restart gry
restartBtn.addEventListener("click", () => {
  bird = { x: 50, y: 150, width: 20, height: 20, velocity: 0 };
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  gameOverScreen.classList.add("hidden");
  update();
});

update();