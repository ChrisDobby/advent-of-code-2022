type HeightMap = string[][]
type Point = [number, number]
type QueueItem = { point: Point; steps: number }

const getElevationValue = (value: string) => value.replace('S', 'a').replace('E', 'z').charCodeAt(0) - 97

const getPointsWithValue = (heightMap: HeightMap, value: string): Point[] =>
  heightMap.flatMap((row, rowIndex) => row.flatMap((col, colIndex) => (col === value ? [[rowIndex, colIndex] as Point] : [])))

const getElevationValueAtPoint = (heightMap: HeightMap, point: Point) => getElevationValue(heightMap[point[0]][point[1]])

const getMinimumStepsForPoints = (queueItems: QueueItem[]): QueueItem[] =>
  queueItems.reduce((acc, { point, steps }) => {
    const existing = acc.find(({ point: existingPoint }) => existingPoint[0] === point[0] && existingPoint[1] === point[1])
    if (!existing) return [...acc, { point, steps }]
    if (existing.steps > steps) return [...acc.filter(({ point: existingPoint }) => existingPoint[0] !== point[0] && existingPoint[1] !== point[1]), { point, steps }]
    return acc
  }, [] as QueueItem[])

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

const breadthFirstSearch = (heightMap: HeightMap, finish: Point, queue: QueueItem[], alreadyVisited: string[] = []): number => {
  const stepsToFinish = queue
    .filter(({ point }) => point[0] === finish[0] && point[1] === finish[1])
    .map(({ steps }) => steps)
    .reduce((acc, steps) => Math.min(acc, steps), Number.MAX_SAFE_INTEGER)
  if (stepsToFinish !== Number.MAX_SAFE_INTEGER) return stepsToFinish

  const visited = new Set([...alreadyVisited, ...queue.map(({ point }) => point.toString())])
  const updatedQueue = getMinimumStepsForPoints(
    queue.flatMap(({ point: queuePoint, steps }) =>
      getValidNeighbours(heightMap, queuePoint)
        .filter(point => !visited.has(point.toString()))
        .map(point => ({ point, steps: steps + 1 }))
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

const numberOfStepsFromStart = breadthFirstSearch(heightMap, finishingPoint, [{ point: startingPoint, steps: 0 }])
const shortestRouteFromA = breadthFirstSearch(
  heightMap,
  finishingPoint,
  aPoints.map(point => ({ point, steps: 0 }))
)
console.log(numberOfStepsFromStart)
console.log(shortestRouteFromA)
