import {execa as _execa} from 'execa'

function execa(...args) {
  const child = _execa(...args)

  child.on('exit', (code, signal) => {
    if (signal) process.exit(1)
    if (code !== 0) process.exit(code)
  })

  return child
}

execa.sync = _execa.sync
export default execa
