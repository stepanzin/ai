/**
 * D3 Graph start here
 */
const w = document.querySelector('body').offsetWidth
const h = document.querySelector('body').offsetHeight
  // ************** Generate the tree diagram	 *****************
const margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
}
const width = w - margin.right - margin.left
const height = h - margin.top - margin.bottom
let i = 0
const tree = d3.layout.tree()
  .size([height, width])
const diagonal = d3.svg.diagonal()
  .projection(d => {
    return [d.x, d.y];
  });
const svg = d3.select('body').append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const update = source => {
  // Compute the new tree layout.
  const nodes = tree.nodes(root).reverse()
  const links = tree.links(nodes)
  // Normalize for fixed-depth.
  nodes.forEach(d => {
    d.y = d.depth * 140
  })
  // Declare the nodes…
  const node = svg.selectAll('g.node')
    .data(nodes, d => {
      return d.id || (d.id = ++i)
    })
  // Enter the nodes.
  const nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', d => {
      return 'translate(' + d.x + ',' + d.y + ')'
    })
  //array figure
  nodeEnter.append('rect')
    .attr('x', -25)
    .attr('y', -25)
    .attr('width', 50)
    .attr('height', 50)
    .style('fill', '#fff')
  //array text
  for (let el = 0; el < 9; el++) {
    nodeEnter.append('text')
      .attr('x', () => ((el % 3)) * 15 - 18)
      .attr('y', () => (~~(el / 3) - 1) * 15)
      .attr('dy', '.35em')
      .text(d => d.arr[el])
      .style('fill-opacity', 1)
  }
  //weight figure
  nodeEnter.append('circle')
    .attr('cx', 35)
    .attr('cy', -33)
    .attr('r', 13)
    .style('fill', '#fff')
  //weight text
  nodeEnter.append('text')
    .attr('x', d => {
      if (d.weight >= 100) return 25
      else if (d.weight >= 10) return 28
      return 31
    })
    .attr('y', -33)
    .attr('dy', '.35em')
    .text(d => {
      return d.weight
    })
    .style('fill-opacity', 1);
  // Declare the links…
  const link = svg.selectAll('path.link')
    .data(links, d => {
      return d.target.id
    });
  // Enter the links.
  link.enter().insert('path', 'g')
    .attr('class', 'link')
    .attr('d', diagonal)
}
