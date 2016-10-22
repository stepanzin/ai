//=require modules/fifteenModel.js
//=require modules/polyfills.js

/*
 * GraphNode class
 * constructor args
 * @param  {Arrat} arr        [description]
 * @param  {GraphNode} left   [description]
 * @param  {GraphNode} mid    [description]
 * @param  {GraphNode} rigth  [description]
 * @param  {GraphNode} parent [description]
 * @param  {Array} dest       [description]
 * @param  {Number} [stage=0] [description]
 */
class GraphNode {
  constructor(arr, left, mid, rigth, parent, dest, stage = 0) {
    this.arr = arr
    this.left = left
    this.mid = mid
    this.right = rigth
    this.parent = parent
    this.dest = dest
    this.diff = 0
    this.stage = stage
  }

  isSolved() {
    let res = null
    if (!this.arr.diff(this.dest).length)
      res = {
        currentNode: this,
        parentNode: this.parent,
        memory: this.diff,
      }
    return res
  }

  calcDiff() {
    return (this.arr.diff(this.parent.dest).length + this.stage) || 0
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
  set setDiff(d) {
    this.diff = d
  }

}

class AStar {
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
    this.queue = [this.s]
  }

  generateArray() {
    return [1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5).concat(0)
  }

  // graphWalk(node) {
  //   function* iterTree(tree) {
  //     if (Array.isArray(tree)) {
  //       for (let i = 0; i < tree.length; i++) {
  //         yield* iterTree(tree[i])
  //       }
  //     } else {
  //       yield tree;
  //     }
  //   }
  // }

  moveHole(arr, move) {
    const hole = arr.indexOf(this.hole)
    const i = hole + move
    if (!arr[i]) return false
    else if (move === this.move.left && !(hole % 3)) return false
    else if (move === this.move.right && !((hole + 1) % 3)) return false
    else if (move === this.move.up && i < 0) return false
    else if (move === this.move.down && i > 9) return false
    arr.swap(i, hole)
    return arr
  }

  queueComp(a) {
    let find = false
    if (!a) return find
    this.queue.forEach(e => {
      if (Array.isArray(e))
        if (!e.diff(a).length) {
          find = true
        }
    })
    return find
  }

  successors(node, route) {
    const el = this.moveHole(node, route)
    if (!this.queueComp(el) && el) {
      this.queue.push(el)
      return el
    }
    return false
  }

  startSolver() {
    const bench = new Date()
    const lurd = [
      this.move.left,
      this.move.up,
      this.move.right,
      this.move.down,
    ]
    const nodeNames = ['left', 'mid', 'right']
    let solved = false
    let stage = 0
    let selectedNode = this.startNode
    do {
      console.log('stage:', stage)
      stage++
      const newarr = []
      const estimation = []
      for (let i = 0; i < 4; i++) {
        const standart = selectedNode.arr.slice(0)
        const successorsElement = this.successors(standart, lurd[i])
        if (successorsElement) newarr.push(successorsElement)
      }
      if (!newarr.length) break
      newarr.forEach((e, i) => {
        const newNode = new GraphNode(e, null, null, null, selectedNode, this.d, stage)
        const diff = newNode.calcDiff()
        newNode.diff = diff
        selectedNode[nodeNames[i]] = newNode
        estimation.push(diff)
        if (!solved) solved = newNode.isSolved()
      })
      const min = estimation.min()
      const index = []
      estimation.filter((e, i) => {
        if (e === min) index.push(i)
      })
      if (index.length === 1) selectedNode = selectedNode[nodeNames[index[0]]]
      // TODO: realize 
      // if 2 or more match then
      // run successors for this nodes
      else if (index.length > 1) {

      }

      console.log('estimation:', estimation)
    } while (!solved)

    console.log('Solved at:', new Date() - bench, 'ms')
    console.log('Root Node:', this.startNode)
    console.log('Stage:', stage)
    console.log('Results:', solved)
  }
}

const game = new AStar([2, 8, 3, 1, 6, 4, 7, 0, 5], [1, 2, 3, 8, 0, 4, 7, 6, 5])
game.startSolver()
