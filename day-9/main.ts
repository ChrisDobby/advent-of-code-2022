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
  let { x, y } = fromCoords

  const diff = { x: toCoords.x - x, y: toCoords.y - y }

  if (diff.x > 0) x++
  if (diff.x < 0) x--
  if (diff.y > 0) y++
  if (diff.y < 0) y--

  return { x, y }
}

const isTouching = ({ x, y }: Coords, previousKnotCoords: Coords): boolean => getTouchingCoords(previousKnotCoords).some(coords => coords.x === x && coords.y === y)
const moveKnot = (knotCoords: Coords, previousKnotCoords: Coords) => (isTouching(knotCoords, previousKnotCoords) ? knotCoords : moveTowards(knotCoords, previousKnotCoords))
const moveRope = (rope: Coords[], direction: Direction) =>
  rope.reduce((coords, knot, index) => [...coords, index === 0 ? move[direction](knot) : moveKnot(knot, coords[index - 1])], [] as Coords[])

const moves = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .filter(Boolean)
  .map(line => line.split(' '))
  .flatMap(([direction, count]) => [...Array.from(new Array(Number(count))).map(() => direction)] as Direction[])

const { tailHistory } = moves.reduce(
  (state, direction) => {
    const rope = moveRope(state.rope, direction)
    return { rope, tailHistory: [...state.tailHistory, rope[rope.length - 1]] }
  },
  {
    rope: Array.from(new Array(NUMBER_OF_KNOTS)).map(() => ({ x: 0, y: 0 })),
    tailHistory: [{ x: 0, y: 0 }],
  }
)

const uniqueTailHistoryLength = tailHistory.filter((coords, index) => tailHistory.findIndex(c => c.x === coords.x && c.y === coords.y) === index).length
console.log(uniqueTailHistoryLength)
