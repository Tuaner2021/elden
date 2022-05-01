const execa = require('execa')

execa.sync('turbo', ['run', 'build'], {
  stdio: 'inherit',
})
