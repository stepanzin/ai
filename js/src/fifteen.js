//=require modules/fifteenModel.js

// Строим модель.
const fifteen = {
  // Направления движения, можно совместить с кодами клавиш. Но это модель, она ничего не должна знать о внешнем мире.
  Move: {
    up: -4,
    left: -1,
    down: 4,
    right: 1,
  },
  // Массив чисел, отсортированный в случайном порядке, добавлям 0 последним элементов.
  order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].sort(() => Math.random() - 0.5).concat(0),
  // Расположение дырки
  hole: 15,
  // Проверка на собранность
  isCompleted() {
    return !this.order.some((item, i) => item > 0 && item - 1 !== i)
  },
  // Ход
  go(move) {
    const i = this.hole + move
    if (!this.order[i]) return false
    // не всякое движение вправо-влево допустимо
    if (move === this.Move.left || move === this.Move.right)
      if (Math.floor(this.hole / 4) !== Math.floor(i / 4)) return false
    this.swap(i, this.hole)
    this.hole = i
    return true
  },
  // перестановка ячеек
  swap(i1, i2) {
    [this.order[i1], this.order[i2]] = [this.order[i2], this.order[i1]]
  },
  // проверка на решаемость
  solvable(a) {
    let kDisorder = 0
    for (let i = 1, len = a.length - 1; i < len; i++)
      for (let j = i - 1; j >= 0; j--)
        if (a[j] > a[i]) kDisorder++
    return !(kDisorder % 2)
  },
}

// Если пазл нерешаемый, делаем его решаемым.
if (!fifteen.solvable(fifteen.order)) fifteen.swap(0, 1)

// Создаем видимые элементы
const box = document.body.appendChild(document.createElement('div'))
for (let i = 0; i < 16; i++) box.appendChild(document.createElement('div'))

// Обрабатываем нажатия кнопок
window.addEventListener('keydown', (e) => {
  if (fifteen.go(fifteen.Move[{
    39: 'left',
    37: 'right',
    40: 'up',
    38: 'down',
  }[e.keyCode]])) {
    draw()
    if (fifteen.isCompleted()) {
      box.style.backgroundColor = 'gold'
      window.removeEventListener('keydown')
    }
  }
});

// Рисуем пятнашки
function draw() {
  for (let i = 0, tile; tile = box.childNodes[i], i < 16; i++) {
    tile.textContent = fifteen.order[i]
    tile.style.visibility = fifteen.order[i] ? 'visible' : 'hidden'
  }
}

draw();

// возврат координат {x, y} по индексу
const coords = index => {
  return {
    x: index % 4 + 1,
    y: ~~(index / 4) + 1,
  }
}
  // индекс ячейки с координатами x, y
const index = (x, y) => ((y - 1) * 4 + x - 1)
