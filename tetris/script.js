const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 20;

const colors = ["cyan","blue","orange","yellow","green","purple","red"];
const SHAPES = [
  [[1,1,1,1]],                   // I
  [[2,0,0],[2,2,2]],             // J
  [[0,0,3],[3,3,3]],             // L
  [[4,4],[4,4]],                 // O
  [[0,5,5],[5,5,0]],             // S
  [[0,6,0],[6,6,6]],             // T
  [[7,7,0],[0,7,7]]              // Z
];

let grid = Array.from({length: ROWS}, () => Array(COLS).fill(0));
let current = {};
let next = {};
let score = 0;
let gameOver = false;

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

function randomShape() {
  let index = Math.floor(Math.random() * SHAPES.length);
  return { shape: SHAPES[index], color: colors[index], x: Math.floor(COLS/2)-1, y: 0 };
}

function drawBlock(x,y,color) {
  ctx.fillStyle = color;
  ctx.fillRect(x*BLOCK_SIZE,y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
  ctx.strokeStyle="#111";
  ctx.strokeRect(x*BLOCK_SIZE,y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
}

function drawGrid() {
  ctx.fillStyle="#000";
  ctx.fillRect(0,0,COLS*BLOCK_SIZE,ROWS*BLOCK_SIZE);
  for (let r=0;r<ROWS;r++) {
    for (let c=0;c<COLS;c++) {
      if(grid[r][c]) drawBlock(c,r,grid[r][c]);
    }
  }
}

function drawCurrent() {
  current.shape.forEach((row, y) => {
    row.forEach((value,x)=>{
      if(value) drawBlock(current.x+x,current.y+y,current.color);
    });
  });
}

function merge() {
  current.shape.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if(value) grid[current.y+y][current.x+x] = current.color;
    });
  });
}

function collision(nx,ny,shape=current.shape) {
  for(let y=0;y<shape.length;y++){
    for(let x=0;x<shape[y].length;x++){
      if(shape[y][x]){
        let newX = nx+x;
        let newY = ny+y;
        if(newX<0 || newX>=COLS || newY>=ROWS) return true;
        if(newY>=0 && grid[newY][newX]) return true;
      }
    }
  }
  return false;
}

function rotate(shape) {
  return shape[0].map((_,i)=>shape.map(row=>row[i])).reverse();
}

function drop() {
  if(!collision(current.x,current.y+1)){
    current.y++;
  } else {
    merge();
    clearLines();
    current = next;
    next = randomShape();
    if(collision(current.x,current.y,current.shape)) endGame();
  }
}

function clearLines() {
  let lines=0;
  for(let r=ROWS-1;r>=0;r--){
    if(grid[r].every(cell=>cell)){
      grid.splice(r,1);
      grid.unshift(Array(COLS).fill(0));
      lines++;
      r++;
    }
  }
  score += lines*10;
  document.getElementById("score").innerText = "Score: "+score;
}

function move(dir) {
  if(!collision(current.x+dir,current.y)) current.x+=dir;
}

function rotateCurrent() {
  let newShape = rotate(current.shape);
  if(!collision(current.x,current.y,newShape)) current.shape=newShape;
}

let dropInterval = 500;
let lastTime=0;

function update(time=0){
  if(gameOver) return;
  if(time-lastTime>dropInterval){
    drop();
    lastTime=time;
  }
  drawGrid();
  drawCurrent();
  requestAnimationFrame(update);
}

// PC - strzałki
document.addEventListener("keydown",e=>{
  if(gameOver) return;
  if(e.key==="ArrowLeft") move(-1);
  if(e.key==="ArrowRight") move(1);
  if(e.key==="ArrowUp") rotateCurrent();
  if(e.key==="ArrowDown") drop();
});

// Touch (telefon)
let startX=0, startY=0;
canvas.addEventListener("touchstart",e=>{
  startX=e.touches[0].clientX;
  startY=e.touches[0].clientY;
});
canvas.addEventListener("touchend",e=>{
  let dx=e.changedTouches[0].clientX-startX;
  let dy=e.changedTouches[0].clientY-startY;
  if(Math.abs(dx)>Math.abs(dy)){
    if(dx>30) move(1);
    else if(dx<-30) move(-1);
  } else {
    if(dy>30) drop();
    else if(dy<-30) rotateCurrent();
  }
});

function endGame(){
  gameOver=true;
  finalScore.textContent="Twój wynik: "+score;
  gameOverScreen.classList.remove("hidden");
}

restartBtn.addEventListener("click",()=>{
  grid = Array.from({length: ROWS}, () => Array(COLS).fill(0));
  current = randomShape();
  next = randomShape();
  score=0;
  gameOver=false;
  gameOverScreen.classList.add("hidden");
  update();
});

current = randomShape();
next = randomShape();
update();