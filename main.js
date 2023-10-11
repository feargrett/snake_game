// Obtén el elemento del canvas y su contexto
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

// Tamaño del lienzo y de los cuadrados
const canvasSize = 520;
const gridSize = 20;

// Inicialización de la serpiente
let snake = [{ x: 40, y: 40 }];
let dx = gridSize;
let dy = 0;

// Comida
let food = { x: (canvasSize / 2) - gridSize , y: (canvasSize / 2) - gridSize };

// Puntuación
let score = 0;

// Función para dibujar la serpiente
function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = 'rgb(0,' + (100 + (index * 5 ))  + ', 0)'
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });
}

// Función para dibujar la comida
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Función para verificar la tecla presionada
let lastKey = null;
function checkKey(event) {
  const keyPressed = event.key;

  switch (keyPressed) {
    case "ArrowUp":
      lastKey = "ArrowUp";
      break;
    case "ArrowDown":
      lastKey = "ArrowDown";
      break;
    case "ArrowLeft":
      lastKey = "ArrowLeft";
      break;
    case "ArrowRight":
      lastKey = "ArrowRight";
      break;
  }
}

// Función para actualizar la dirección de la serpiente
function changeDirection() {
  switch (lastKey) {
    case "ArrowUp":
      if (dy !== gridSize) {
        dx = 0;
        dy = -gridSize;
      }
      break;
    case "ArrowDown":
      if (dy !== -gridSize) {
        dx = 0;
        dy = gridSize;
      }
      break;
    case "ArrowLeft":
      if (dx !== gridSize) {
        dx = -gridSize;
        dy = 0;
      }
      break;
    case "ArrowRight":
      if (dx !== -gridSize) {
        dx = gridSize;
        dy = 0;
      }
      break;
  }
}

// Función para generar números aleatorios múltiplos de un número
function numerosMultiplosRandom(min, max, multiplo) {
  const numeroAleatorio = Math.floor(Math.random() * (max - min + 1) + min);
  const result = Math.ceil(numeroAleatorio / multiplo) * multiplo;
  return result;
}

// Función para verificar si la serpiente choca consigo misma
function checkCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

// Función principal del juego
function gameLoop() {

  changeDirection();

  // Mueve la serpiente
  const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(newHead);

  // Comprueba colisión con la comida
  if (newHead.x === food.x && newHead.y === food.y) {
    score += 10;

    // Genera nueva comida en una posición aleatoria que no sea la anterior
    // y que no esté en la posición de la serpiente
    const old_x = food.x;
    const old_y = food.y;
    let new_x;
    let new_y;
    do {
      new_x = numerosMultiplosRandom(0, (canvasSize - gridSize), gridSize);
      new_y = numerosMultiplosRandom(0, (canvasSize - gridSize), gridSize);
    } while ((new_x === old_x && new_y === old_y) || snake.some(segment => segment.x === new_x && segment.y === new_y));

    // Genera nueva comida
    food = {
      x: new_x,
      y: new_y
    };

  } else {
    // Si no comió, elimina la cola de la serpiente
    snake.pop();
  }

  // Limpia el lienzo
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Dibuja la serpiente y la comida
  drawSnake();
  drawFood();

  // Comprueba colisión con las paredes o consigo misma
  if (
    newHead.x < 0 ||
    newHead.x > (canvasSize - gridSize) ||
    newHead.y < 0 ||
    newHead.y > (canvasSize - gridSize) ||
    checkCollision()
  ) {
    alert("Juego terminado. Puntuación: " + score);
    location.reload(); // Recarga la página para reiniciar el juego
  }

  // Repite la función
  setTimeout(gameLoop, 100);
}

// Inicia el juego
document.addEventListener("keydown", checkKey);
gameLoop();