//=require modules/fifteenModel.js
//=require modules/es5Features.js

class GraphNode {
  constructor(arr, left, mid, rigth, parent, dest) {
    this.arr = arr
    this.left = left
    this.mid = mid
    this.right = rigth
    this.parent = parent
    this.dest = parent ? parent.dest : dest
    this.mem = parent ? parent.mem + this.calcDiff(parent.dest) : 0
  }

  static isSolved() {
    let res = null
    if (this.arr.diff(this.dest).length)
      res = {
        currentNode: this,
        parentNode: this.parent,
        memory: this.mem,
      }
    return res ? res : false
  }

  static calcDiff(standart) {
    return this.arr.diff(standart).length
  }

  set destArray(arr) {
    this.dest = arr
  }
  set leftNode(left) {
    this.left = left
  }
  set midNode(mid) {
    this.mid = mid
  }
  set rigthNode(right) {
    this.right = right
  }

}

class IDA {
  constructor(sourceArr, destArray) {
    this.s = sourceArr || this.generateArray()
    this.d = destArray
    this.startNode = new GraphNode(this.s, null, null, null, null, this.d)
    this.move = {
      left: -1,
      up: -3,
      right: 1,
      down: 3,
    }
    this.hole = 0
    this.queue = []
  }

  static generateArray() {
    return [1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5).concat(0)
  }

  static graphWalk(node) {
    function* iterTree(tree) {
       if (Array.isArray(tree)) {
           // inner node
           for(let i=0; i < tree.length; i++) {
               setTimeout(()=>yield* iterTree(tree[i]), 500) // (*) recursion
           }
       } else {
           // leaf
           yield tree;
       }
   }
  }

  static moveHole(arr, move) {
    const i = this.hole + move
    if (!arr[i]) return false
    if (move === this.move.left || move === this.move.right)
      if (~~(this.hole / 3) !== ~~(i / 3)) return false
    arr.swap(i, this.hole)
    this.hole = i
    return arr
  }

  static queueComp(a) {
    let find = false
    this.queue.forEach(e => {
      if (e.diff(a)) { find = true }
    })
    return find
  }

  static successors(node, route) {
    if (!this.queueComp(node.arr)) {
      return this.moveHole(node.arr, route)
    }
    return false
  }

  startSolver() {
    const bench = new Date()
    const ruld = [-1, -3, 1, 3]

    let solved = false
    let iteras = 0
    do {
      iteras++
      let currentNode = this.startNode
      for (let i = 0; i < 4; i++) {

        const newarr = this.successors(currentNode.arr, ruld[i])
      }
    } while (!solved)
    console.log('Solved at:', new Date() - bench, 'ms')
  }
}

const ida = new IDA([2, 8, 3, 1, 6, 4, 7, 0, 5], [1, 2, 3, 8, 0, 4, 7, 6, 5])
//
// // Строим модель.
// const fifteen = {
//   // Направления движения, можно совместить с кодами клавиш. Но это модель, она ничего не должна знать о внешнем мире.
//   Move: {
//     up: -3,
//     left: -1,
//     down: 3,
//     right: 1,
//   },
//   // Массив чисел, отсортированный в случайном порядке, добавлям 0 последним элементов.
//   order: [1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5).concat(0),
//   //order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].sort(() => Math.random() - 0.5).concat(0),
//   // Расположение дырки
//   hole: 8,
//   // Проверка на собранность
//   isCompleted() {
//     return
//   },
//   // Ход
//   go(move) {
//     const i = this.hole + move
//     if (!this.order[i]) return false
//     // не всякое движение вправо-влево допустимо
//     if (move === this.Move.left || move === this.Move.right)
//       if (Math.floor(this.hole / 3) !== Math.floor(i / 3)) return false
//     this.swap(i, this.hole)
//     this.hole = i
//     return true
//   },
//   // перестановка ячеек
//   swap(i1, i2) {
//     [this.order[i1], this.order[i2]] = [this.order[i2], this.order[i1]]
//   },
//   // проверка на решаемость
//   solvable(a) {
//     let kDisorder = 0
//     for (let i = 1, len = a.length - 1; i < len; i++)
//       for (let j = i - 1; j >= 0; j--)
//         if (a[j] > a[i]) kDisorder++
//     return !(kDisorder % 2)
//   },
// }
//
// // Если пазл нерешаемый, делаем его решаемым.
// if (!fifteen.solvable(fifteen.order)) fifteen.swap(0, 1)
//
// // Создаем видимые элементы
// const box = document.body.appendChild(document.createElement('main'))
// for (let i = 0; i < 9; i++) {
//   const el = document.createElement('div')
//   el.style.display = 'inline-block'
//   box.appendChild(el)
//   if (((i + 1) % 3) === 0 && i !== 0)
//     box.appendChild(document.createElement('br'))
// }
//
// // Обрабатываем нажатия кнопок
// window.addEventListener('keydown', (e) => {
//   if (fifteen.go(fifteen.Move[{
//     39: 'left',
//     37: 'right',
//     40: 'up',
//     38: 'down',
//   }[e.keyCode]])) {
//     draw()
//     if (fifteen.isCompleted()) {
//       box.style.backgroundColor = 'gold'
//       window.removeEventListener('keydown')
//     }
//   }
// });
//
// // Рисуем пятнашки
// function draw() {
//   for (let i = 0, tile; tile = box.querySelectorAll('div')[i], i < 9; i++) {
//     tile.textContent = fifteen.order[i]
//     tile.style.visibility = fifteen.order[i] ? 'visible' : 'hidden'
//   }
// }
//
// draw();
//
// // возврат координат {x, y} по индексу
// const coords = index => {
//   return {
//     x: index % 3 + 1,
//     y: ~~(index / 3) + 1,
//   }
// }
//   // индекс ячейки с координатами x, y
// const index = (x, y) => ((y - 1) * 3 + x - 1)
