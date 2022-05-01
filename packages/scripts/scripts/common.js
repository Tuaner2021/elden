const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const execa = require('execa')

const getAppPath = () => {
  return path.resolve(process.cwd(), `./apps`)
}

const getPackageName = (appName) => {
  try {
    const { name } = fs.readJSONSync(path.resolve(getAppPath(), appName, 'package.json'))
    return name
  } catch (e) {
    console.log(`${chalk.bold.red(e)} 👋`)
    process.exit()
  }
}

const install = (appName) => {
  if (!appName) {
    execa.sync('pnpm', ['install'], { stdio: 'inherit' })
    return
  }

  const packageName = getPackageName(appName)
  execa.sync('pnpm', ['install', '--filter', `${packageName}`], {
    stdio: 'inherit',
  })
}

const processCancel = () => {
  console.log(`${chalk.bold.yellow('Cancelled...')} 👋`)
  process.exit()
}

module.exports = {
  processCancel,
  getAppPath,
  getPackageName,
  install,
}
