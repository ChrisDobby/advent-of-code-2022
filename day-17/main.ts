type Pos = { x: number; y: number }
type Jet = 1 | -1
type Gas = Jet[]
type Rock = { positions: Pos[]; bottomEdges: number[]; rightEdges: number[]; leftEdges: number[] }

const rocks: ((pos: Pos) => Rock)[] = [
  ({ x, y }: Pos) => ({
    positions: [
      { x, y },
      { x: x + 1, y },
      { x: x + 2, y },
      { x: x + 3, y },
    ],
    bottomEdges: [0, 1, 2, 3],
    rightEdges: [3],
    leftEdges: [0],
  }),
  ({ x, y }: Pos) => ({
    positions: [
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x + 1, y: y + 1 },
      { x: x + 2, y: y + 1 },
      { x: x + 1, y: y + 2 },
    ],
    bottomEdges: [0, 1, 3],
    rightEdges: [0, 3, 4],
    leftEdges: [0, 1, 4],
  }),
  ({ x, y }: Pos) => ({
    positions: [
      { x, y },
      { x: x + 1, y },
      { x: x + 2, y },
      { x: x + 2, y: y + 1 },
      { x: x + 2, y: y + 2 },
    ],
    bottomEdges: [0, 1, 2],
    rightEdges: [2, 3, 4],
    leftEdges: [0, 3, 4],
  }),
  ({ x, y }: Pos) => ({
    positions: [
      { x, y },
      { x, y: y + 1 },
      { x, y: y + 2 },
      { x, y: y + 3 },
    ],
    bottomEdges: [0],
    rightEdges: [0, 1, 2, 3],
    leftEdges: [0, 1, 2, 3],
  }),
  ({ x, y }: Pos) => ({
    positions: [
      { x, y },
      { x: x + 1, y },
      { x: x + 1, y: y + 1 },
      { x, y: y + 1 },
    ],
    bottomEdges: [0, 1],
    rightEdges: [1, 2],
    leftEdges: [0, 3],
  }),
]

const createRock = (index: number, pos: Pos) => rocks[index % 5](pos)

const applyJet = (rockPositions: Pos[], jet: Jet, leftEdges: number[], rightEdges: number[], allRocks: Pos[]) => {
  const afterJet = rockPositions.map(pos => ({ ...pos, x: pos.x + jet }))
  const edgesToTest = jet === 1 ? rightEdges : leftEdges
  const moved = edgesToTest.every(edge => afterJet[edge].x >= 0 && afterJet[edge].x <= 6 && !allRocks.some(pos => pos.x === afterJet[edge].x && pos.y === afterJet[edge].y))
  return moved ? afterJet : rockPositions
}

const applyGravity = (rockPositions: Pos[], bottomEdges: number[], allRocks: Pos[]) => {
  const afterGravity = rockPositions.map(pos => ({ ...pos, y: pos.y - 1 }))
  const moved = bottomEdges.every(edge => afterGravity[edge].y > 0 && !allRocks.some(pos => pos.x === afterGravity[edge].x && pos.y === afterGravity[edge].y))
  return moved ? { moved, rock: afterGravity } : { moved, rock: rockPositions }
}

const rockFall =
  (getJet: (jetIndex: number) => Jet) =>
  ({ positions, bottomEdges, leftEdges, rightEdges }: Rock, startJetIndex: number, allRocks: Pos[]) => {
    let jetIndex = startJetIndex
    let rockPosition = positions
    while (true) {
      const afterJet = applyJet(rockPosition, getJet(jetIndex), leftEdges, rightEdges, allRocks)
      const { moved, rock: afterGravity } = applyGravity(afterJet, bottomEdges, allRocks)
      if (!moved) {
        return { settledRock: afterGravity, lastJetIndex: jetIndex }
      }

      rockPosition = afterGravity
      jetIndex++
    }
  }

const getCacheKey = (rockIndex: number, jetIndex: number, rockPositions: Pos[], top: number) =>
  `${rockIndex}-${jetIndex}-${Array.from({ length: 4 })
    .flatMap((_, y) => Array.from({ length: 7 }).flatMap((_, x) => (rockPositions.find(pos => pos.x === x && pos.y === y + top - 4) ? '1' : '0')))
    .join('')}`

const getHeightOfTower = (numberOfRocks: number, jets: Gas) => {
  let highestY = 0
  let yOffset = 0
  let nextJetIndex = 0
  let allRocks: Pos[] = []
  const seen: Record<string, { rockCount: number; height: number }> = {}
  const rockFallWithJet = rockFall(jetIndex => jets[jetIndex % jets.length])
  let rockCount = 0
  while (rockCount < numberOfRocks) {
    const rock = createRock(rockCount, { x: 2, y: highestY + 4 })
    const { settledRock, lastJetIndex } = rockFallWithJet(rock, nextJetIndex, allRocks)
    allRocks.push(...settledRock)
    nextJetIndex = lastJetIndex + 1
    const topOfRock = Math.max(...settledRock.map(pos => pos.y))
    if (topOfRock > highestY) {
      highestY = topOfRock
    }

    const cacheKey = getCacheKey(rockCount % 5, nextJetIndex % jets.length, allRocks, highestY)
    if (seen[cacheKey]) {
      const { rockCount: seenRockCount, height: seenHeight } = seen[cacheKey]
      const diff = highestY - seenHeight
      const remainingRocks = numberOfRocks - rockCount
      const cycles = Math.floor(remainingRocks / (rockCount - seenRockCount))
      const newHighestY = highestY + diff * cycles
      rockCount += (rockCount - seenRockCount) * cycles
      yOffset = newHighestY - highestY
      highestY = newHighestY
      allRocks = allRocks.map(pos => ({ ...pos, y: pos.y + yOffset }))
    } else {
      seen[cacheKey] = { rockCount, height: highestY }
    }

    rockCount++
  }

  return highestY
}

const gasJets = Deno.readTextFileSync('./input.txt')
  .split('')
  .map(dir => (dir === '<' ? -1 : dir === '>' ? 1 : null))
  .filter(Boolean) as Gas

const heightOf2022 = getHeightOfTower(2022, gasJets)
const heightOf1000000000000 = getHeightOfTower(1000000000000, gasJets)

console.log(heightOf2022)
console.log(heightOf1000000000000)
