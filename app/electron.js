'use strict'

const path = require('path')
const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const fs = require('fs')
const _ = require('lodash')
const CodegirdMarkdown = require('codegrid-markdown')
const cgmd = new CodegirdMarkdown()
const wordCounter = require('./src/wordCounter')
const watcher = {}
const chokidar = require('chokidar')
let mainWindow
let config = {}

if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
//    titleBarStyle: 'hidden',
  })

  mainWindow.loadURL(config.url)

  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

    let installExtension = require('electron-devtools-installer')

    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then((name) => mainWindow.webContents.openDevTools())
      .catch((err) => console.log('An error occurred: ', err))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  function openMarkdown(filepath) {
    const file = fs.readFileSync(filepath, 'utf8')
    const dirname = path.dirname(filepath)
    const replacedFile = file.replace(/\(\.\/(.*)\)/g, (rep, $1) => {
      let local = `${dirname}/${$1}`;
      let img = fs.readFileSync(local)
      return `(data:image/png;base64,${new Buffer(img).toString('base64')})`
    })
    const md = cgmd.render(replacedFile)
    const count = wordCounter(file)
    mainWindow.webContents.send(filepath, {md})
    mainWindow.webContents.send(`${filepath}:count`, {count})
  }

  ipcMain.on('openMarkdown', (e, filepath) => {
    openMarkdown(filepath)

    if (!watcher[filepath]) {
      watcher[filepath] = chokidar.watch(filepath, {
        ignored: /[\/\\]\./
      })
      .on('all', (e, filepath) => {
        mainWindow.webContents.send('updateMarkdown', {filepath})
      })
    }
  })

  ipcMain.on('stopWatching', (e, filepath) => {
    if (watcher[filepath]) {
      watcher[filepath].close();
      watcher[filepath] = null
    }
  })

  console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
