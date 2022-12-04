type RockPaperScissors = 'A' | 'B' | 'C'
type LoseDrawWin = 'X' | 'Y' | 'Z'
type Turn = [RockPaperScissors, LoseDrawWin]

const playerScore: Record<RockPaperScissors, number> = {
  A: 1,
  B: 2,
  C: 3,
}

const playerChoice: Record<LoseDrawWin, Record<RockPaperScissors, RockPaperScissors>> = {
  X: {
    A: 'C',
    B: 'A',
    C: 'B',
  },
  Y: {
    A: 'A',
    B: 'B',
    C: 'C',
  },
  Z: {
    A: 'B',
    B: 'C',
    C: 'A',
  },
}

const turnScore: Record<RockPaperScissors, Record<RockPaperScissors, number>> = {
  A: {
    A: 3,
    B: 0,
    C: 6,
  },
  B: {
    A: 6,
    B: 3,
    C: 0,
  },
  C: {
    A: 0,
    B: 6,
    C: 3,
  },
}

const totalScore = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .filter(line => line !== '')
  .map(line => line.split(' ') as Turn)
  .map(([opponent, player]) => [opponent, playerChoice[player][opponent]])
  .reduce((acc, [opponent, player]) => acc + playerScore[player] + turnScore[player][opponent], 0)

console.log(totalScore)
