const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake = [{x: 10, y:10}];
let dx = 1;
let dy = 0;
let apple = {x:5, y:5};
let score = 0;

const highScoreKey = 'snakeHighScore';
let highScore = localStorage.getItem(highScoreKey) || 0;
document.getElementById('highScore').innerText = highScore;

function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*gridSize, y*gridSize, gridSize-2, gridSize-2);
}

function placeApple() {
    apple.x = Math.floor(Math.random() * canvas.width / gridSize);
    apple.y = Math.floor(Math.random() * canvas.height / gridSize);
}

function update() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Wrap-around (przechodzenie przez krawędzie)
    head.x = (head.x + canvas.width/gridSize) % (canvas.width/gridSize);
    head.y = (head.y + canvas.height/gridSize) % (canvas.height/gridSize);

    // dodanie głowy
    snake.unshift(head);

    // Jedzenie jabłka
    if(head.x === apple.x && head.y === apple.y){
        score++;
        document.getElementById('score').innerText = score;
        placeApple();
        if(score > highScore){
            highScore = score;
            localStorage.setItem(highScoreKey, highScore);
            document.getElementById('highScore').innerText = highScore;
        }
    } else {
        snake.pop(); // usuwa ogon jeśli nie zjadł
    }
}

function draw(){
    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawCell(apple.x, apple.y, "red");
    snake.forEach((segment,index) => drawCell(segment.x, segment.y, index===0?"#0ff":"#0f0"));
}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// sterowanie
document.addEventListener('keydown', e => {
    if(e.key === "ArrowUp" && dy===0){ dx=0; dy=-1; }
    if(e.key === "ArrowDown" && dy===0){ dx=0; dy=1; }
    if(e.key === "ArrowLeft" && dx===0){ dx=-1; dy=0; }
    if(e.key === "ArrowRight" && dx===0){ dx=1; dy=0; }
    if(e.key === "r" || e.key === "R"){ resetGame(); }
});

// reset gry
function resetGame(){
    snake = [{x:10,y:10}];
    dx = 1;
    dy = 0;
    score = 0;
    document.getElementById('score').innerText = score;
    placeApple();
}

placeApple();
gameLoop();