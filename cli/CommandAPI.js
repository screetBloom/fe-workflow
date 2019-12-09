// 抽离脚手架命令行层
const fs = require('fs')
const path = require('path')
const program = require('commander')
const packageConfig = require('../package.json')
const { cleanArgs } = require('../lib')
const boxPath = path.join(process.cwd(), 'box.config.js')
const chalk = require('chalk')

const commandName = exports.commandName = []
const commandStore = exports.commandStore = []
let boxConfig = {}
if (fs.existsSync(boxPath)) boxConfig = require(path.join(process.cwd(), 'box.config.js'))()
let status = 'pending'

program
  .usage('<command> [options]')
  .version(packageConfig.version)

module.exports.injectCommand = function (cmd) {
  if (status === 'done') return console.error('注册命令行时机已经是 done，请提前注册～')
  if (typeof cmd !== 'function') return console.error(cmd, '必须是一个函数')
  cmd({ program, boxConfig, commandName, commandStore, cleanArgs })
}

module.exports.commandComplete = function() {
  commandValidate()
  parse()
  status = 'done'
}

function parse() {
  program.parse(process.argv)
  program.commands.forEach(c => c.on('--help', () => console.log()))
}

function commandValidate() {
  if (process.argv[2] && !commandName.includes(process.argv[2])) {
    console.log()
    console.log(chalk.red(`  没有找到 ${process.argv[2]} 命令`))
    console.log()
    program.help()
  }

  if (!process.argv[2]) {
    program.help()
  }
}
