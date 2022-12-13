type Entry = number | number[]
type Pair = [Entry, Entry]
type Comparison = 'equal' | 'correct' | 'incorrect'

const comparePair = ([entry1, entry2]: Pair): Comparison => {
  switch (true) {
    case Number.isSafeInteger(entry1) && Number.isSafeInteger(entry2):
      return entry1 === entry2 ? 'equal' : entry1 < entry2 ? 'correct' : 'incorrect'
    case Array.isArray(entry1) && Array.isArray(entry2): {
      const list1 = entry1 as number[]
      const list2 = entry2 as number[]
      return Array.from(new Array(Math.max(list1.length, list2.length))).reduce((acc, _, index) => (acc === 'equal' ? comparePair([list1[index], list2[index]]) : acc), 'equal')
    }
    case Number.isSafeInteger(entry1):
      return comparePair([[entry1 as number], entry2])
    case Number.isSafeInteger(entry2):
      return comparePair([entry1, [entry2 as number]])
    case !entry1:
      return 'correct'
    case !entry2:
      return 'incorrect'
    default:
      console.log('in default', entry1, entry2)
      return 'equal'
  }
}

const packets = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .filter(Boolean)
  .map(line => JSON.parse(line) as Entry)

const comparedPairs = (
  packets.reduce((acc, line) => {
    const lastPair = acc[acc.length - 1]
    if (!lastPair || lastPair.length === 2) {
      acc.push([line])
    } else {
      lastPair.push(line)
    }

    return acc
  }, [] as Entry[][]) as Pair[]
).map((pair, index) => ({ index: index + 1, result: comparePair(pair) }))

const sumOfCorrectIndices = comparedPairs.filter(({ result }) => result === 'correct').reduce((acc, { index }) => acc + index, 0)

const [divider1, divider2] = [...packets, [2], [6]]
  .sort((packet1, packet2) => {
    switch (comparePair([packet1, packet2])) {
      case 'equal':
        return 0
      case 'correct':
        return -1
      case 'incorrect':
        return 1
    }
  })
  .map((packet, index) => ({ index: index + 1, packet }))
  .filter(({ packet }) => JSON.stringify(packet) === JSON.stringify([2]) || JSON.stringify(packet) === JSON.stringify([6]))

const decoderKey = divider1.index * divider2.index

console.log(sumOfCorrectIndices)
console.log(decoderKey)
