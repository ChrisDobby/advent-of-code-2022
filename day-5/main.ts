const transformInput = (input: string[]) => {
  return {
    stacks: input
      .slice(0, input.indexOf('') - 1)
      .reverse()
      .map(line => line.match(/.{1,4}/g)?.map(createStr => createStr.replace(/[ \[\]]/g, '')) as string[])
      .reduce((acc, crates) => {
        crates.forEach((crate, index) => {
          if (crate) {
            if (acc[index]) acc[index].push(crate)
            else acc[index] = [crate]
          }
        })
        return acc
      }, [] as string[][]),
    moves: input
      .filter(line => line.startsWith('move'))
      .map(line => line.split(' '))
      .map(parts => ({ count: Number(parts[1]), from: Number(parts[3]), to: Number(parts[5]) })),
  }
}
const { stacks, moves } = transformInput(Deno.readTextFileSync('./input.txt').split('\n'))

const movedBy9000 = moves.reduce((acc, { count, from, to }) => {
  for (let i = 0; i < count; i++) {
    acc[to - 1].push(acc[from - 1].pop() as string)
  }

  return acc
}, JSON.parse(JSON.stringify(stacks)) as string[][])

const movedBy9001 = moves.reduce((acc, { count, from, to }) => {
  const moved = acc[from - 1].splice(-count)
  acc[to - 1].push(...moved)
  return acc
}, JSON.parse(JSON.stringify(stacks)) as string[][])

const messagePart1 = movedBy9000.map(stack => stack[stack.length - 1]).join('')
const messagePart2 = movedBy9001.map(stack => stack[stack.length - 1]).join('')

console.log(messagePart1)
console.log(messagePart2)
