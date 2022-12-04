const expandAssignment = (assignment: string): number[] => {
  const [start, end] = assignment.split('-')
  return Array.from(new Array(parseInt(end) - parseInt(start) + 1)).map((_, i) => parseInt(start) + i)
}

const isFullyContained = ([assignment1, assignment2]: [number[], number[]]) => assignment1.every(n => assignment2.includes(n)) || assignment2.every(n => assignment1.includes(n))
const isOverlapping = ([assignment1, assignment2]: [number[], number[]]) => assignment1.some(n => assignment2.includes(n)) || assignment2.some(n => assignment1.includes(n))

const assignments = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .filter(line => line !== '')
  .map(line => line.split(',') as [string, string])
  .map(([assignment1, assignment2]) => [expandAssignment(assignment1), expandAssignment(assignment2)] as [number[], number[]])

const fullyContainedAssignments = assignments.filter(isFullyContained).length
const overlappingAssignments = assignments.filter(isOverlapping).length

console.log(fullyContainedAssignments)
console.log(overlappingAssignments)
