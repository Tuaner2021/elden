const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const chalk = require('chalk')
const _ = require('lodash')
const { Input, Select } = require('enquirer')
const { processCancel, getAppPath, install } = require('./common')

const templatePath = path.resolve(__dirname, `../templates`)
const appPath = getAppPath()

// lodash template compiled
const createCompiled = (content) => {
  _.templateSettings.interpolate = /<%=([\s\S]+?)%>/g
  return _.template(content)
}

const create = (appName, templateName) => {
  const templateFilePath = path.resolve(templatePath, `${templateName}`)
  const matches = glob.sync('**/@(.*|*.*)', {
    cwd: templateFilePath,
    dot: true,
    nodir: true,
  })

  for (const match of matches) {
    const file = path.resolve(templateFilePath, match)
    const dist = path.resolve(appPath, appName, match)
    const content = fs.readFileSync(file, 'utf-8')
    const compiled = createCompiled(content)
    fs.outputFileSync(dist, compiled({ name: appName }), {
      encoding: 'utf-8',
      flag: 'w+',
    })
  }

  install(appName)
}

const checkAppName = (appName) => {
  if (!appName) {
    console.log(chalk.bold.red('Please specify the project name'))
    process.exit()
  }
  if (glob.sync('*', { cwd: appPath }).includes(appName)) {
    console.log(chalk.bold.red(`The directory ${appName} contains files that could conflict`))
    process.exit()
  }
}

// create start
;(async () => {
  const appName = await new Input({
    message: chalk.bold.green('Please enter a name for the application'),
    initial: '',
  })
    .run()
    .catch(processCancel)

  checkAppName(appName)

  const templateName = await new Select({
    name: 'template',
    message: chalk.bold.green('Please pick a template'),
    choices: glob.sync('*', { cwd: templatePath }),
  })
    .run()
    .catch(processCancel)

  // 创建项目
  create(appName, templateName)
})()
