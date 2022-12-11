type Monkey = {
  items: number[]
  operation: string
  testDivisibleBy: number
  trueMonkey: number
  falseMonkey: number
  inspected?: number
}

type MonkeyProperty = 'Starting items' | 'Operation' | 'Test' | 'If true' | 'If false'

type Throw = {
  fromMonkeyIndex: number
  toMonkeyIndex: number
  item: number
}

const monkeyProperties: Record<MonkeyProperty, (monkey: Monkey, value: string) => Monkey> = {
  'Starting items': (monkey: Monkey, value: string) => ({ ...monkey, items: value.split(',').map(i => Number(i)) }),
  Operation: (monkey: Monkey, value: string) => ({ ...monkey, operation: value.split('=').slice(-1)[0] }),
  Test: (monkey: Monkey, value: string) => ({ ...monkey, testDivisibleBy: Number(value.split(' ').slice(-1)[0]) }),
  'If true': (monkey: Monkey, value: string) => ({ ...monkey, trueMonkey: Number(value.split(' ').slice(-1)[0]) }),
  'If false': (monkey: Monkey, value: string) => ({ ...monkey, falseMonkey: Number(value.split(' ').slice(-1)[0]) }),
}

const getMonkeyBusiness = (inspectionCounts: number[]): number => {
  const [first, second] = inspectionCounts.sort((a, b) => a - b).slice(-2)
  return first * second
}

const getWorryLevel = (operation: string, item: number): number => Number(eval(operation.replaceAll('old', item.toString())))

const getThrow = (worryLevel: number, monkey: Monkey): Omit<Throw, 'fromMonkeyIndex'> =>
  worryLevel % monkey.testDivisibleBy === 0 ? { toMonkeyIndex: monkey.trueMonkey, item: worryLevel } : { toMonkeyIndex: monkey.falseMonkey, item: worryLevel }

const inspect = (monkey: Monkey, worryLevel: number /* item: number*/): Omit<Throw, 'fromMonkeyIndex'> => getThrow(worryLevel, monkey)

const makeThrow = (monkeys: Monkey[], originalItem: number, { fromMonkeyIndex, toMonkeyIndex, item }: Throw): Monkey[] => {
  monkeys[fromMonkeyIndex].items = monkeys[fromMonkeyIndex].items.filter(item => item !== originalItem)
  monkeys[fromMonkeyIndex].inspected = (monkeys[fromMonkeyIndex].inspected || 0) + 1
  monkeys[toMonkeyIndex].items.push(item)

  return monkeys
}

const turn =
  (manageLevels: (value: number) => number) =>
  (monkeys: Monkey[], turnIndex: number): Monkey[] =>
    monkeys[turnIndex].items.reduce(
      (acc, item) => makeThrow(acc, item, { ...inspect(monkeys[turnIndex], manageLevels(getWorryLevel(monkeys[turnIndex].operation, item))), fromMonkeyIndex: turnIndex }),
      [...monkeys]
    )

const monkeys = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .filter(Boolean)
  .map(line => line.trim())
  .map(line => line.split(': ') as [MonkeyProperty, string])
  .reduce((acc, [property, value]) => {
    if (property.startsWith('Monkey')) {
      return [...acc, { items: [], operation: '', testDivisibleBy: 0, trueMonkey: 0, falseMonkey: 0 }]
    }

    acc[acc.length - 1] = monkeyProperties[property](acc[acc.length - 1], value)
    return acc
  }, [] as Monkey[])

const monkeysAfter20Rounds = Array.from(new Array(monkeys.length * 20))
  .map((_, index) => index % monkeys.length)
  .reduce((acc, monkeyIndex) => turn(value => Math.floor(value / 3))(acc, monkeyIndex), JSON.parse(JSON.stringify(monkeys)) as Monkey[])

const monkeyBusinessAfter20Rounds = getMonkeyBusiness(monkeysAfter20Rounds.map(monkey => monkey.inspected || 0))
console.log(monkeyBusinessAfter20Rounds)
