type File = { name: string; size: number }
type Directory = { name: string; files: File[]; directories: Directory[] }
type State = {
  fileSystem: Directory
  currentDirectory: number[]
}

const getCurrentDirectory = (fileSystem: Directory, currentDirectory: number[]): Directory => currentDirectory.reduce((acc, index) => acc.directories[index], fileSystem)

const processCd = (directory: string, state: State): number[] => {
  switch (directory) {
    case '..':
      return state.currentDirectory.slice(0, -1)
    case '/':
      return []
    default:
      return [...state.currentDirectory, getCurrentDirectory(state.fileSystem, state.currentDirectory).directories.findIndex(dir => dir.name === directory)]
  }
}

const operateOnFileSystem = (fileSystem: Directory, func: (directory: Directory) => void) => {
  const clonedFileSystem: Directory = JSON.parse(JSON.stringify(fileSystem))
  func(clonedFileSystem)
  return clonedFileSystem
}

const addNewDirectory = (directory: string, state: State): Directory =>
  operateOnFileSystem(state.fileSystem, dir => getCurrentDirectory(dir, state.currentDirectory).directories.push({ name: directory, files: [], directories: [] }))
const addFileToCurrentDirectory = (file: File, state: State): Directory =>
  operateOnFileSystem(state.fileSystem, dir => getCurrentDirectory(dir, state.currentDirectory).files.push(file))

const processCommand = (commandString: string, state: State): State => {
  const [, command, argument] = commandString.split(' ')
  return command === 'cd' ? { ...state, currentDirectory: processCd(argument, state) } : state
}

const processOutput = (output: string, state: State): State => {
  const [part1, part2] = output.split(' ')
  return part1 === 'dir'
    ? { ...state, fileSystem: addNewDirectory(part2, state) }
    : { ...state, fileSystem: addFileToCurrentDirectory({ name: part2, size: Number(part1) }, state) }
}

const processLine = (state: State, line: string): State => (line.startsWith('$') ? processCommand(line, state) : processOutput(line, state))

const calculateTotalSize = (directory: Directory): number =>
  directory.files.reduce((acc, file) => acc + file.size, 0) + directory.directories.reduce((acc, dir) => acc + calculateTotalSize(dir), 0)

const getAllDirectorySizes = (directory: Directory): { name: string; size: number }[] =>
  [{ name: directory.name, size: calculateTotalSize(directory) }].concat(
    directory.directories.reduce((acc, dir) => acc.concat(getAllDirectorySizes(dir)), [] as { name: string; size: number }[])
  )
const { fileSystem } = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .filter(Boolean)
  .reduce(processLine, { fileSystem: { name: '/', files: [], directories: [] }, currentDirectory: [] } as State)

const directorySizes = getAllDirectorySizes(fileSystem)
const totalSizeBelow100000 = directorySizes.filter(({ size }) => size <= 100000).reduce((acc, { size }) => acc + size, 0)

const requiredSpace = 30000000 - (70000000 - directorySizes[0].size)
const directorySizeToDelete = Math.min(...directorySizes.map(({ size }) => size).filter(size => size >= requiredSpace))

console.log(totalSizeBelow100000)
console.log(directorySizeToDelete)
