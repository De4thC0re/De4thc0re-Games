const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let dino = { x: 50, y: 150, width: 20, height: 20, dy: 0, gravity: 0.7, jumpPower: -12 };
let obstacles = [];
let frame = 0;
let score = 0;

const highScoreKey = 'dinoHighScore';
let highScore = localStorage.getItem(highScoreKey) || 0;
document.getElementById('highScore').innerText = highScore;

function spawnObstacle() {
  const height = Math.random() * 40 + 20;
  obstacles.push({ x: canvas.width, y: 200 - height, width: 20, height: height });
}

function update() {
  frame++;
  dino.dy += dino.gravity;
  dino.y += dino.dy;

  if(dino.y > 180){ 
    dino.y = 180; 
    dino.dy = 0; 
  }

  if(frame % 90 === 0) spawnObstacle();

  obstacles.forEach(obs => obs.x -= 5);
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  // kolizja
  for(let obs of obstacles){
    if(dino.x < obs.x + obs.width && dino.x + dino.width > obs.x &&
       dino.y < obs.y + obs.height && dino.y + dino.height > obs.y){
      resetGame();
      return;
    }
  }

  score++;
  document.getElementById('score').innerText = score;
  if(score > highScore){
    highScore = score;
    localStorage.setItem(highScoreKey, highScore);
    document.getElementById('highScore').innerText = highScore;
  }
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "#0f0";
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

  ctx.fillStyle = "#f00";
  obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obs.width, obs.height));
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// sterowanie
document.addEventListener('keydown', e => {
  if(e.key === " " || e.key === "ArrowUp") {
    if(dino.y === 180) dino.dy = dino.jumpPower;
  }
  if(e.key === "r" || e.key === "R") resetGame();
});

canvas.addEventListener('click', () => {
  if(dino.y === 180) dino.dy = dino.jumpPower;
});

function resetGame() {
  dino.y = 180;
  dino.dy = 0;
  obstacles = [];
  score = 0;
  document.getElementById('score').innerText = score;
}

gameLoop();