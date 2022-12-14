type Coord = { x: number; y: number }

const createPath = (from: Coord, to: Coord) => {
  switch (true) {
    case from.x !== to.x:
      return Array.from(new Array(Math.abs(from.x - to.x) + 1))
        .map((_, index) => index + (from.x < to.x ? from.x : to.x))
        .map(x => ({ x, y: from.y }))
    case from.y !== to.y:
      return Array.from(new Array(Math.abs(from.y - to.y) + 1))
        .map((_, index) => index + (from.y < to.y ? from.y : to.y))
        .map(y => ({ x: from.x, y }))
    default:
      return []
  }
}

const getCoordsFromPath = (path: string) =>
  path
    .split('->')
    .map(coord => coord.trim())
    .map(coord => {
      const [x, y] = coord.split(',').map(Number)
      return { x, y }
    })
    .reduce((acc, coord, index, array) => {
      return index === 0 ? acc : [...acc, ...createPath(array[index - 1], coord)]
    }, [] as Coord[])

const getNextCoord = (current: Coord, filled: Coord[]) => {
  if (!filled.find(coord => coord.x === current.x && coord.y === current.y + 1)) return { x: current.x, y: current.y + 1 }
  if (!filled.find(coord => coord.x === current.x - 1 && coord.y === current.y + 1)) return { x: current.x - 1, y: current.y + 1 }
  if (!filled.find(coord => coord.x === current.x + 1 && coord.y === current.y + 1)) return { x: current.x + 1, y: current.y + 1 }
  return null
}

const pourGrain = (startingCoord: Coord, filled: Coord[], heighestAvailableY: number, hasFloor?: boolean) => {
  let finishingCoord = startingCoord
  while (true) {
    const nextCoord = getNextCoord(finishingCoord, filled)
    if (!nextCoord) break
    if (nextCoord.y === heighestAvailableY) return hasFloor ? nextCoord : null

    finishingCoord = nextCoord
  }

  return finishingCoord
}

const pourSand = (rocks: Coord[], hasFloor?: boolean) => {
  const startingCoord = { x: 500, y: 0 }
  const highestAvailableY = Math.max(...rocks.map(({ y }) => y)) + 1
  const grainCoords: Coord[] = []
  let grainCoord = pourGrain(startingCoord, rocks, highestAvailableY)
  while (grainCoord) {
    if (grainCoord.y === highestAvailableY && !hasFloor) break

    grainCoords.push(grainCoord)

    if (grainCoord.x === startingCoord.x && grainCoord.y === startingCoord.y) break

    grainCoord = pourGrain(startingCoord, [...rocks, ...grainCoords], highestAvailableY, hasFloor)
  }

  return grainCoords
}

const rocks = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .filter(Boolean)
  .reduce((acc, line) => [...acc, ...getCoordsFromPath(line)], [] as Coord[])

const settledGrains = pourSand(rocks).length
console.log(settledGrains)

const settledGrainsWithFloor = pourSand(rocks, true).length
console.log(settledGrainsWithFloor)
