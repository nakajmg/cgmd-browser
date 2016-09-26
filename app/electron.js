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

  const menu = Menu.buildFromTemplate([
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        },
        {
          label: 'Search',
          accelerator: 'Cmd+F',
          click() {
            mainWindow.webContents.send('cmd-toggle-search')
          }
        }
      ]
    },
    {
      label: 'Tabs',
      submenu: [
        {
          label: 'Add Tab',
          accelerator: 'Cmd+T',
          click() {
            mainWindow.webContents.send('cmd-open-file')
          }
        },
        {
          label: 'Close Tab',
          accelerator: 'Cmd+W',
          click() {
            mainWindow.webContents.send('cmd-tabs-close')
          }
        },
        {
          label: 'Open on Editor',
          accelerator: 'Alt+O',
          click() {
            mainWindow.webContents.send('cmd-open-on-editor')
          }
        },
        {
          label: 'Move Right',
          accelerator: 'Ctrl+Tab',
          click() {
            mainWindow.webContents.send('cmd-tabs-move-right')
          }
        },
        {
          label: 'Move Left',
          accelerator: 'Ctrl+Shift+Tab',
          click() {
            mainWindow.webContents.send('cmd-tabs-move-left')
          }
        },
        {
          label: 'Reload',
          accelerator: 'Cmd+R',
          click() {
            mainWindow.webContents.reload()
          }
        }
      ]
    },
    {
      label: 'Favorite',
      submenu: [
        {
          label: 'Toggle Favorite',
          accelerator: 'Cmd+D',
          click() {
            mainWindow.webContents.send('cmd-toggle-favorite')
          }
        },
        {
          label: 'Toggle Favorite List',
          accelerator: 'Cmd+B',
          click() {
            mainWindow.webContents.send('cmd-toggle-favorite-list')
          }
        }
      ]
    },
    {
      label: 'Debug',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I'
            }
            else {
              return 'Ctrl+Shift+I'
            }
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.webContents.toggleDevTools()
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

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
