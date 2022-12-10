type Operation = 'noop' | 'addx'

const operationResults: Record<Operation, { cycles: number; process: (arg: number) => number }> = {
  noop: { cycles: 1, process: () => 0 },
  addx: { cycles: 2, process: arg => arg },
}

const getPixel = (position: number, registerValue: number) => (registerValue === position || registerValue === position - 1 || registerValue === position + 1 ? '#' : '.')

const { register } = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .filter(Boolean)
  .map(line => line.split(' '))
  .map(([operation, arg]) => [operation as Operation, Number(arg)] as [Operation, number])
  .reduce(
    (acc, [operation, arg]) => ({
      register: [...acc.register, ...Array.from(new Array(operationResults[operation].cycles)).map(() => acc.next)],
      next: acc.next + operationResults[operation].process(arg),
    }),
    { register: [] as number[], next: 1 }
  )

const total = register.reduce((acc, value, index) => (index % 40 === 19 ? acc + (index + 1) * value : acc), 0)

const display = register
  .reduce((acc, value, index) => {
    const row = Math.floor(index / 40)
    if (acc[row]) {
      acc[row].push(getPixel(index - row * 40, value))
    } else {
      acc.push([getPixel(index - row * 40, value)])
    }

    return acc
  }, [] as string[][])
  .map(row => row.join(''))

console.log(total)
console.log(display)
