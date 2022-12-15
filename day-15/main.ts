type Coord = { x: number; y: number }
type Position = { sensor: Coord; beacon: Coord; distance: number }

const calculateDistance = (from: Coord, to: Coord): number => Math.abs(from.x - to.x) + Math.abs(from.y - to.y)

const getPositionsWithNoBeacon = (positions: Position[], y: number) => {
  const fromX = Math.min(...positions.map(({ beacon }) => beacon.x)) - 2
  const toX = Math.max(...positions.map(({ beacon }) => beacon.x)) + 2

  return Array.from(new Array(toX - fromX + 1), (_, i) => i + fromX).filter(
    x =>
      positions.some(position => calculateDistance({ x, y }, position.sensor) <= position.distance) &&
      !positions.some(position => position.beacon.x === x && position.beacon.y === y)
  )
}

const getEdge = ({ sensor, distance }: Position) => Array.from(new Array(distance + 2)).flatMap((_, i) => [{ x: sensor.x + i, y: sensor.y - distance + i - 1 }])

const getDistressBeaconFrequency = (positions: Position[], max: number) => {
  const beaconCoords = positions
    .flatMap(getEdge)
    .filter(({ x, y }) => x >= 0 && x < max && y >= 0 && y < max)
    .filter(coord => positions.every(position => calculateDistance(coord, position.sensor) > position.distance))[0]
  return beaconCoords.x * 4000000 + beaconCoords.y
}

const positions = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .filter(Boolean)
  .map(line => line.split(':'))
  .map(items => items.flatMap(item => item.trim().split(',')))
  .map(items => ({
    sensor: { x: Number(items[0].split('=')[1]), y: Number(items[1].split('=')[1]) },
    beacon: { x: Number(items[2].split('=')[1]), y: Number(items[3].split('=')[1]) },
  }))
  .map(({ sensor, beacon }) => ({
    sensor,
    beacon,
    distance: calculateDistance(sensor, beacon),
  }))

const positionsWithNoBeacon = getPositionsWithNoBeacon(positions, 2000000)
console.log(positionsWithNoBeacon.length)

const distressBeaconFrequency = getDistressBeaconFrequency(positions, 4000000)
console.log(distressBeaconFrequency)
