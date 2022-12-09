type Coords = { x: number; y: number }
type Direction = 'R' | 'L' | 'U' | 'D'

const NUMBER_OF_KNOTS = 10

const move: Record<Direction, (coords: Coords) => Coords> = {
  R: ({ x, y }) => ({ x: x + 1, y }),
  L: ({ x, y }) => ({ x: x - 1, y }),
  U: ({ x, y }) => ({ x, y: y + 1 }),
  D: ({ x, y }) => ({ x, y: y - 1 }),
}

const getTouchingCoords = ({ x, y }: Coords): Coords[] => [
  { x, y },
  { x: x + 1, y },
  { x: x - 1, y },
  { x, y: y + 1 },
  { x, y: y - 1 },
  { x: x - 1, y: y - 1 },
  { x: x - 1, y: y + 1 },
  { x: x + 1, y: y + 1 },
  { x: x + 1, y: y - 1 },
]

const moveTowards = (fromCoords: Coords, toCoords: Coords): Coords => {
  let newX = fromCoords.x
  let newY = fromCoords.y

  const xDiff = toCoords.x - fromCoords.x
  const yDiff = toCoords.y - fromCoords.y

  if (xDiff > 0) newX++
  if (xDiff < 0) newX--
  if (yDiff > 0) newY++
  if (yDiff < 0) newY--

  return { x: newX, y: newY }
}

const isTouching = ({ x, y }: Coords, previousKnotCoords: Coords): boolean => getTouchingCoords(previousKnotCoords).some(coords => coords.x === x && coords.y === y)
const moveKnot = (knotCoords: Coords, previousKnotCoords: Coords) => (isTouching(knotCoords, previousKnotCoords) ? knotCoords : moveTowards(knotCoords, previousKnotCoords))
const moveRope = (knotCoords: Coords[], direction: Direction) =>
  knotCoords.reduce((coords, knot, index) => [...coords, index === 0 ? move[direction](knot) : moveKnot(knot, coords[index - 1])], [] as Coords[])

const moves = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .filter(Boolean)
  .map(line => line.split(' '))
  .flatMap(([direction, count]) => [...Array.from(new Array(Number(count))).map(() => direction)] as Direction[])

const { tailHistory } = moves.reduce(
  (state, direction) => {
    const knots = moveRope(state.knots, direction)
    return { knots, tailHistory: [...state.tailHistory, knots[knots.length - 1]] }
  },
  {
    knots: Array.from(new Array(NUMBER_OF_KNOTS)).map(() => ({ x: 0, y: 0 })),
    tailHistory: [{ x: 0, y: 0 }],
  }
)

const uniqueTailHistoryLength = tailHistory.filter((coords, index) => tailHistory.findIndex(c => c.x === coords.x && c.y === coords.y) === index).length
console.log(uniqueTailHistoryLength)
