import SevenZip from "7z-wasm";
import wasmUrl from '7z-wasm/7zz.wasm?url'

const WORKING_DIRECTORY = '/working'

let stdoutBuffer = ''

const module = {
  locateFile: (_p, _u) => wasmUrl,
  preRun: [
    function () {
      module.FS.mkdir(WORKING_DIRECTORY)
      module.FS.chdir(WORKING_DIRECTORY)
    },
  ],
  print: data => stdoutBuffer += data + '\n',
}
let sevenZip = await SevenZip(module)
// window.sevenZip = sevenZip

function saveResultToFS(name, callback, event) {
  // console.log(event)
  const arrayBuffer = event.target.result
  sevenZip.FS.writeFile(name, new Uint8Array(arrayBuffer))

  callback(name)
}

function loadFile(file, callback, error) {
  const reader = new FileReader()
  reader.addEventListener('load', saveResultToFS.bind(null, file.name, callback))
  typeof error === 'function' && reader.addEventListener('error', error)
  reader.readAsArrayBuffer(file)
}

function parse7zList(input) {
  const lines = input.trim().split('\n');
  const files = []
  let fileInfo = {};

  lines.forEach(line => {
    if (line.indexOf(' = ') === -1) {
      console.debug("Skipping line:", line)
      return;
    }
    const [key, value] = line.split(' = ');
    // console.log(key, value)
    if (key === 'Path') {
      if (Object.keys(fileInfo).length > 0) {
        files.push(fileInfo);
      }
      fileInfo = {}
      fileInfo['Path'] = value.trim();
    } else {
      fileInfo[key.trim()] = value.trim();
    }
  });

  files.push(fileInfo);
  return files;
}

function listContents(name) {
  const args = [
    'l',
    '-ba',  // no header
    '-bd',  // no progress
    '-slt',  // machine readable
    name
  ]

  stdoutBuffer = ''
  sevenZip.callMain(args)

  const output = parse7zList(stdoutBuffer)

  const files = []
  for (const fileInfo of output) {
    const path = fileInfo.Path

    // parse path and build directory structure
    const parts = path.split('/')
    let parent = files
    for (const [index, part] of parts.entries()) {
      let entry = parent.find(file => file.name === part)
      if (!entry) {
        entry = {
          name: part,
          children: [],
          path: parts.slice(0, index + 1).join('/')
        }
        if (index == parts.length - 1) {
          // add file info here
          delete fileInfo.Path
          entry = {
            name: parts[parts.length - 1],
            ...entry,
            ...fileInfo
          }
        }
        parent.push(entry)
      }
      parent = entry.children
    }
  }

  return files
}

function clearFileSystem(dir = WORKING_DIRECTORY) {
  console.debug("Clearing file system:", dir)

  const files = sevenZip.FS.readdir(dir)
  for (const file of files) {
    if (file !== '.' && file !== '..') {
      const path = dir + '/' + file
      const stat = sevenZip.FS.stat(path)
      if (sevenZip.FS.isDir(stat.mode)) {
        console.debug("Removing directory:", path)
        clearFileSystem(path)
        sevenZip.FS.rmdir(path)
      } else {
        console.debug("Removing file:", path)
        sevenZip.FS.unlink(path)
      }
    }
  }
}

function extractFiles(name, paths) {
  const args = [
    'x',
    '-bd',  // no progress
    '-ba',  // no header
    '-aoa',  // always replace
    name,
    ...paths
  ]

  console.debug("Calling 7z-wasm with", args)

  stdoutBuffer = ''
  sevenZip.callMain(args)
  console.debug("7z output:", stdoutBuffer)

  const files = []
  for (const path of paths) {
    // XXX: 7z-wasm quirks
    sevenZip.FS.chmod(path, 0o644)
    const file = sevenZip.FS.readFile(path)
    files.push(file)
  }
  return files
}

export {
  sevenZip,
  loadFile,
  listContents,
  extractFiles,
  clearFileSystem,
}