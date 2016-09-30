'use strict'
const request = require('request').defaults({ encoding: null });
const path = require('path')
const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const fs = require('fs')
const _ = require('lodash')
const CodegirdMarkdown = require('codegrid-markdown')
const cgmd = new CodegirdMarkdown()
const wordCounter = require('./src/wordCounter')
const watcher = {}
const chokidar = require('chokidar')
const jade = require('jade')
const axios = require('axios')
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
      label: 'prevue',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
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
        },
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
          accelerator: 'Cmd+B',
          click() {
            mainWindow.webContents.send('cmd-toggle-favorite')
          }
        },
        {
          label: 'Toggle Favorite List',
          accelerator: 'Cmd+Shift+B',
          click() {
            mainWindow.webContents.send('cmd-toggle-favorite-list')
          }
        }
      ]
    },
//    {
//      label: 'Speech',
//      submenu: [
//        {
//          role: 'startspeaking'
//        },
//        {
//          role: 'stopspeaking'
//        }
//      ]
//    },
    {
      label: 'Finder',
      submenu: [
        {
          label: 'Set Directory',
          accelerator: 'Alt+D',
          click() {
            mainWindow.webContents.send('cmd-set-directory')
          }
        },
        {
          label: 'Toggle Finder',
          accelerator: 'Cmd+Shift+D',
          click() {
            mainWindow.webContents.send('cmd-toggle-directory')
          }
        },
        {
          label: 'Search on Finder',
          accelerator: 'Cmd+D',
          click() {
            mainWindow.webContents.send('cmd-search-directory')
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
    const extension = path.extname(filepath)
    const count = wordCounter(file)

    if (extension === '.jade') {
      const html = jade.render(file)
      mainWindow.webContents.send(filepath, {md: html})
      mainWindow.webContents.send(`${filepath}:count`, {count})
      return
    }
    const dirname = path.dirname(filepath)
    const replacedFile = file.replace(/\(\.\/(.*)\)/g, (rep, $1) => {
      let local = `${dirname}/${$1}`;
      let img = fs.readFileSync(local)
      return `(data:image/png;base64,${new Buffer(img).toString('base64')})`
    })
    const urls = []
    replacedFile.replace(/<iframe.*(data-)?src="(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))".*<\/iframe>/g, (rep, $1, $2) => {
      urls.push($2)
      return rep
    })

    const md = cgmd.render(replacedFile)
    mainWindow.webContents.send(filepath, {md})
    mainWindow.webContents.send(`${filepath}:count`, {count})

    const externalImages = []
    md.replace(/<img.*?src="(https?:\/\/.*?)".*?>/g, (rep, $1) => {
      externalImages.push($1)
      return rep
    })

    externalImages.forEach((src) => {
      request.get(`${src}`, (err, response, body) => {
        if (err) return
        const data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
        
        mainWindow.webContents.send('attachExternalImage', {filepath, src, data})
      })
    })
    
    // ローカルじゃない画像を取得してhtmlに埋め込む処理
    urls.forEach((url) => {
      axios.get(url)
        .then((res) => {
          const dir = path.dirname(url)
          const images = []
          res.data.replace(/<img.*?src="(.*)".*?\/>/g, (rep, $1) => {
            images.push(`${$1}`)
            return rep
          })

          const html = res.data

          // iframe内の画像をdarauriに変換して埋め込む
          const promises = images.map((src) => {
            return new Promise(function(resolve, reject) {
              request.get(`${dir}${path.sep}${src}`, (err, response, body) => {
                if (err) reject(err)
                const data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                resolve({src, data})
              })
            })

          })

          Promise.all(promises)
            .then((ress) => {
              let replaced = html
              ress.forEach((res) => {
                let regex = new RegExp(`<img.*src="${res.src}".*\/>`)

                replaced = replaced.replace(regex, (rep) => {
                  return `<img src="${res.data}" />`
                })
              })

              mainWindow.webContents.send('attachFrameContent', { filepath ,url, html: replaced })

            }, (err) => {
              console.log('fail')
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    })
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
