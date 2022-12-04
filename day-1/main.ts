const highestThree = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .reduce(
    (acc, line) => {
      if (line === '') return [...acc, 0]
      acc[acc.length - 1] += parseInt(line)
      return acc
    },
    [0]
  )
  .sort((n1: number, n2: number) => n2 - n1)
  .slice(0, 3)
  .reduce((acc, n) => acc + n, 0)

console.log(highestThree)
