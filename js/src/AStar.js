//=require modules/polyfills.js

/**
 * GraphNode class
 * constructor args
 * @param  {Array} arr        [description]
 * @param  {GraphNode} left   [description]
 * @param  {GraphNode} mid    [description]
 * @param  {GraphNode} rigth  [description]
 * @param  {GraphNode} parent [description]
 * @param  {Array} dest       [description]
 * @param  {Integer} stage    [description]
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

/**
 * A* class
 * constructor
 * @param  {Array} sourceArr [source array]
 * @param  {Array} destArray [destination array]
 */
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
    this.graph = {}
  }

  generateArray() {
    return [1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5).concat(0)
  }

  traverseTree(node, depth = 0) {
    const nodeObj = {
      'name': depth ? depth + ' step' : 'Start',
      'arr': node.arr,
      'weight': node.diff,
      'parent': node.parent,
      'children': [],
    }
    depth++
    if (node.left) nodeObj.children.push(this.traverseTree(node.left, depth))
    if (node.mid) nodeObj.children.push(this.traverseTree(node.mid, depth))
    if (node.right) nodeObj.children.push(this.traverseTree(node.right, depth))

    return nodeObj
  }

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
    return new Promise((resolve, reject) => {
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
        else if (index.length > 1) {
          selectedNode = selectedNode[nodeNames[index[0]]]
        }
      } while (!solved)

      const endBench = (new Date() - bench) + ' ms'
      console.log('Solved at:', endBench)
      console.log('Root Node:', this.startNode)
      this.graph = this.traverseTree(this.startNode)
      resolve(this.graph, endBench)
    });

  }
}

//=require modules/d3-graph.js
