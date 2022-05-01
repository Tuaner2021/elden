const execa = require('execa')
const glob = require('glob')
const chalk = require('chalk')
const { Select } = require('enquirer')
const { processCancel, getAppPath, getPackageName, install } = require('./common')

const appPath = getAppPath()

const runDev = (appName) => {
  install(appName)
  const packageName = getPackageName(appName)
  execa.sync('turbo', ['run', 'dev', `--filter=${packageName}`], {
    stdio: 'inherit',
  })
}

;(async () => {
  const apps = glob.sync('*', { cwd: appPath })

  if (!apps.length) {
    console.log(chalk.bold.yellow('No app found to start'))
    process.exit()
  }

  const appName = await new Select({
    name: 'template',
    message: chalk.bold.green('Select a app to start'),
    choices: [...apps],
  })
    .run()
    .catch(processCancel)

  runDev(appName)
})()
