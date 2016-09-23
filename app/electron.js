'use strict'

const path = require('path')
const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const fs = require('fs')
const _ = require('lodash')
const CodegirdMarkdown = require('codegrid-markdown')
const cgmd = new CodegirdMarkdown()

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
    titleBarStyle: 'hidden'
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

  ipcMain.on('openMarkdown', (e, filepath) => {
    const file = fs.readFileSync(filepath, 'utf8')
    const dirname = path.dirname(filepath)
    const md = cgmd.render(file)
    mainWindow.webContents.send(filepath, {md})
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
