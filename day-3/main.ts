const itemsInAll = (rucksacks: string[]): string[] => Array.from(new Set(rucksacks[0].split('').filter(item => rucksacks.every(rucksack => rucksack.includes(item)))))

const calculateValue = (item: string): number => {
  const code = item.charCodeAt(0)
  return code >= 97 ? code - 96 : code - 38
}

const getValues = (transform: (rucksacks: string[]) => string[][]) =>
  transform(
    Deno.readTextFileSync('./input.txt')
      .split('\n')
      .filter(line => line !== '')
  )
    .flatMap(itemsInAll)
    .reduce((acc, item) => acc + calculateValue(item), 0)

const compartmentValues = getValues(rucksacks => rucksacks.map(line => [line.slice(0, line.length / 2), line.slice(line.length / 2)] as [string, string]))
const badgeValues = getValues(rucksacks =>
  rucksacks.reduce(
    (acc, line) => {
      if (acc[acc.length - 1].length === 3) {
        acc.push([line])
      } else {
        acc[acc.length - 1].push(line)
      }

      return acc
    },
    [[]] as string[][]
  )
)

console.log(compartmentValues)
console.log(badgeValues)
