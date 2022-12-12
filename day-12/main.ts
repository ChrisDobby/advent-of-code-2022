type HeightMap = string[][]
type Point = [number, number]

const getElevationValue = (value: string) => value.replace('S', 'a').replace('E', 'z').charCodeAt(0) - 97

const getPointsWithValue = (heightMap: HeightMap, value: string): Point[] =>
  heightMap.flatMap((row, rowIndex) => row.flatMap((col, colIndex) => (col === value ? [[rowIndex, colIndex] as Point] : [])))

const getElevationValueAtPoint = (heightMap: HeightMap, point: Point) => getElevationValue(heightMap[point[0]][point[1]])

const getMinimumStepsForPoints = (queueItems: [Point, number][]): [Point, number][] =>
  queueItems.reduce((acc, [point, steps]) => {
    const existingSteps = acc.find(([existingPoint, _]) => existingPoint[0] === point[0] && existingPoint[1] === point[1])
    if (!existingSteps) return [...acc, [point, steps]]
    if (existingSteps[1] > steps) return [...acc.filter(([existingPoint, _]) => existingPoint[0] !== point[0] && existingPoint[1] !== point[1]), [point, steps]]
    return acc
  }, [] as [Point, number][])

const getValidNeighbours = (heightMap: HeightMap, point: Point): Point[] =>
  (
    [
      [point[0] - 1, point[1]],
      [point[0] + 1, point[1]],
      [point[0], point[1] - 1],
      [point[0], point[1] + 1],
    ] as Point[]
  )
    .filter(([row, col]) => row >= 0 && col >= 0 && row < heightMap.length && col < heightMap[0].length)
    .filter(neighbour => getElevationValueAtPoint(heightMap, neighbour) <= getElevationValueAtPoint(heightMap, point) + 1)

const breadthFirstSearch = (heightMap: HeightMap, finish: Point, queue: [Point, number][], alreadyVisited: string[] = []): number => {
  const stepsToFinish = queue
    .filter(([point, _]) => point[0] === finish[0] && point[1] === finish[1])
    .map(([_, steps]) => steps)
    .reduce((acc, steps) => Math.min(acc, steps), Number.MAX_SAFE_INTEGER)
  if (stepsToFinish !== Number.MAX_SAFE_INTEGER) return stepsToFinish

  const visited = new Set([...alreadyVisited, ...queue.map(([point, _]) => point.toString())])
  const updatedQueue = getMinimumStepsForPoints(
    queue.flatMap(([queuePoint, steps]) =>
      getValidNeighbours(heightMap, queuePoint)
        .filter(point => !visited.has(point.toString()))
        .map(point => [point, steps + 1] as [Point, number])
    )
  )

  return breadthFirstSearch(heightMap, finish, updatedQueue, [...visited])
}

const heightMap = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .filter(Boolean)
  .map(line => line.split(''))
const startingPoint = getPointsWithValue(heightMap, 'S')[0]
const finishingPoint = getPointsWithValue(heightMap, 'E')[0]
const aPoints = [startingPoint, ...getPointsWithValue(heightMap, 'a')]

const numberOfStepsFromStart = breadthFirstSearch(heightMap, finishingPoint, [[startingPoint, 0]])
const shortestRouteFromA = breadthFirstSearch(
  heightMap,
  finishingPoint,
  aPoints.map(point => [point, 0])
)
console.log(numberOfStepsFromStart)
console.log(shortestRouteFromA)
