const gridElement = document.getElementById("grid");
const scoreElement = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

let grid = [];
let score = 0;
let gameOver = false;

// Inicjalizacja pustej planszy 4x4
function initGrid() {
  grid = Array.from({ length: 4 }, () => Array(4).fill(0));
  addRandomTile();
  addRandomTile();
  drawGrid();
  updateScore();
}

// Dodawanie losowej kafelki (2 lub 4)
function addRandomTile() {
  let empty = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

// Rysowanie planszy
function drawGrid() {
  gridElement.innerHTML = "";
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = grid[r][c] === 0 ? "" : grid[r][c];
      gridElement.appendChild(cell);
    }
  }
}

// Aktualizacja wyniku
function updateScore() {
  scoreElement.textContent = "Score: " + score;
}

// Sprawdzenie końca gry
function checkGameOver() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return false;
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
    }
  }
  return true;
}

// Funkcja przesuwania kafelków
function move(direction) {
  let moved = false;

  function slide(row) {
    let arr = row.filter(n => n);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter(n => n);
    while (arr.length < 4) arr.push(0);
    return arr;
  }

  if (direction === "left") {
    for (let r = 0; r < 4; r++) {
      let newRow = slide(grid[r]);
      if (!grid[r].every((v,i)=>v===newRow[i])) moved = true;
      grid[r] = newRow;
    }
  } else if (direction === "right") {
    for (let r = 0; r < 4; r++) {
      let newRow = slide(grid[r].slice().reverse()).reverse();
      if (!grid[r].every((v,i)=>v===newRow[i])) moved = true;
      grid[r] = newRow;
    }
  } else if (direction === "up") {
    for (let c = 0; c < 4; c++) {
      let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
      let newCol = slide(col);
      for (let r = 0; r < 4; r++) {
        if (grid[r][c] !== newCol[r]) moved = true;
        grid[r][c] = newCol[r];
      }
    }
  } else if (direction === "down") {
    for (let c = 0; c < 4; c++) {
      let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
      let newCol = slide(col.reverse()).reverse();
      for (let r = 0; r < 4; r++) {
        if (grid[r][c] !== newCol[r]) moved = true;
        grid[r][c] = newCol[r];
      }
    }
  }

  if (moved) {
    addRandomTile();
    drawGrid();
    updateScore();
    if (checkGameOver()) endGame();
  }
}

// Obsługa klawiatury (PC)
document.addEventListener("keydown", e => {
  if (gameOver) return;
  if (e.key === "ArrowUp") move("up");
  if (e.key === "ArrowDown") move("down");
  if (e.key === "ArrowLeft") move("left");
  if (e.key === "ArrowRight") move("right");
});

// Obsługa dotyku (telefon)
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
document.addEventListener("touchend", e => {
  let dx = e.changedTouches[0].clientX - touchStartX;
  let dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) move("right");
    else if (dx < -30) move("left");
  } else {
    if (dy > 30) move("down");
    else if (dy < -30) move("up");
  }
});

// Funkcja końca gry
function endGame() {
  gameOver = true;
  finalScore.textContent = "Twój wynik: " + score;
  gameOverScreen.classList.remove("hidden");
}

// Restart gry
restartBtn.addEventListener("click", () => {
  score = 0;
  gameOver = false;
  gameOverScreen.classList.add("hidden");
  initGrid();
});

initGrid();