const execa = require('execa')
const [script] = process.argv.slice(2)
const scriptPath = './scripts/'

execa.sync('node', [require.resolve(`${scriptPath}${script}`)], {
  stdio: 'inherit',
})
