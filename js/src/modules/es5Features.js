Array.prototype.diff = function(a) {
  var diffArray = []
  this.forEach(function (e, i) {
    if (e !== a[i]) diffArray.push(e)
  })
  return diffArray
}
Array.prototype.swap = function (a, b) {
  return [this[a], this[b]] = [this[b], this[a]]
}
