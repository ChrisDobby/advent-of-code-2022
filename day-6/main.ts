const input = Deno.readTextFileSync('./input.txt').replace('\n', '')

const findUniqueChars = (input: string, numberOfChars: number) => {
  let charsToTest = ''
  for (const [index, char] of input.split('').entries()) {
    charsToTest += char
    if (charsToTest.length > numberOfChars) {
      charsToTest = charsToTest.slice(1)
    }

    if (charsToTest.length === numberOfChars && new Set(charsToTest).size === numberOfChars) {
      return index + 1
    }
  }
}

const startOfPacketMarker = findUniqueChars(input, 4)
const startOfMessageMarker = findUniqueChars(input, 14)

console.log(startOfPacketMarker)
console.log(startOfMessageMarker)
