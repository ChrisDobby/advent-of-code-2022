const getTreesFromPoint = (grid: number[][], row: number, col: number) => ({
  left: Array.from(new Array(col))
    .map((_, index) => grid[row][index])
    .reverse(),
  right: Array.from(new Array(grid[0].length - col - 1)).map((_, index) => grid[row][index + col + 1]),
  above: Array.from(new Array(row))
    .map((_, index) => grid[index][col])
    .reverse(),
  below: Array.from(new Array(grid.length - row - 1)).map((_, index) => grid[index + row + 1][col]),
})

const isVisible = (grid: number[][], row: number, col: number) => {
  const height = grid[row][col]
  const { left, right, above, below } = getTreesFromPoint(grid, row, col)
  return height > Math.max(...above) || height > Math.max(...below) || height > Math.max(...left) || height > Math.max(...right)
}

const calculateViewingDistance = (treeHeight: number, heights: number[]) => {
  const index = heights.findIndex(height => height >= treeHeight)
  return index === -1 ? heights.length : index + 1
}

const getScenicScore = (grid: number[][], row: number, col: number) => {
  const { left, right, above, below } = getTreesFromPoint(grid, row, col)

  const height = grid[row][col]
  return calculateViewingDistance(height, left) * calculateViewingDistance(height, right) * calculateViewingDistance(height, above) * calculateViewingDistance(height, below)
}

const grid = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .filter(Boolean)
  .map(line => line.split('').map(ch => Number(ch)))

const numberOfVisibleTrees = grid.flatMap((row, rowIndex) => row.map((_, colIndex) => isVisible(grid, rowIndex, colIndex))).filter(Boolean).length
const highestScenicScore = Math.max(...grid.flatMap((row, rowIndex) => row.map((_, colIndex) => getScenicScore(grid, rowIndex, colIndex))))

console.log(numberOfVisibleTrees)
console.log(highestScenicScore)
