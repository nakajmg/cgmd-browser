'use strict'
const request = require('request').defaults({ encoding: null });
const path = require('path')
const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const fs = require('fs')
const CodegirdMarkdown = require('codegrid-markdown')
const cgmd = new CodegirdMarkdown()
const wordCounter = require('./src/wordCounter')
const watcher = {}
const chokidar = require('chokidar')
const axios = require('axios')
let mainWindow
let config = {}
const linter = require('./linter')

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
    width: 900,
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
          label: 'Toggle Viewport Resizer',
          accelerator: 'Cmd+Shift+I',
          click() {
            mainWindow.webContents.send('cmd-toggle-viewport')
          }
        },
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
        },
        {
          label: 'Toggle Textlint Reporter',
          accelerator: 'Cmd+Shift+T',
          click() {
            mainWindow.webContents.send('cmd-toggle-textlint')
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  function openMarkdown(filepath, dicpath) {
    fs.readFile(filepath, 'utf8', (err, file) => {
      if (err) {
        mainWindow.webContents.send(filepath, {err, filepath})
        return
      }

      if (dicpath) {
        linter(filepath, [dicpath])
          .then((results) => {
            mainWindow.webContents.send('textlintResult', {results, filepath})
          })
      }
//      const extension = path.extname(filepath)
      const count = wordCounter(file)

      const dirname = path.dirname(filepath)
      // ローカルの画像を読み込んでbase64で埋め込む
      const replacedFile = file.replace(/!\[(.*?)\]\(\.\/(.*)\)/g, (rep, $1, $2) => {
        let local = `${dirname}/${$2}`;
        try {
          let img = fs.readFileSync(local)
          return `(data:image/png;base64,${new Buffer(img).toString('base64')})`
        }
        catch(err) {
          // ファイルが読み込めなかったらそのまま返す
          return `![${$1}](./${$2})`
        }
      })

      // iframe の src を収集
      const urls = []
      replacedFile.replace(/<iframe.*(data-)?src="(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))".*<\/iframe>/g, (rep, $1, $2) => {
        urls.push($2)
        return rep
      })

      const md = cgmd.render(replacedFile)
      mainWindow.webContents.send(filepath, {md, filepath})
      mainWindow.webContents.send(`${filepath}:count`, {count})

      const externalImages = []

      md.replace(/<img.*?src="(https?:\/\/.*?)".*?>/g, (rep, $1) => {
        externalImages.push($1)
        return rep
      })

      // 外部URLの画像をリクエストしてbase64で埋め込む
      externalImages.forEach((src) => {
        request.get(`${src}`, (err, response, body) => {
          if (err) return
          const data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');

          mainWindow.webContents.send('attachExternalImage', {filepath, src, data})
        })
      })

      // ifame の src をリクエスト
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
    })
  }

  ipcMain.on('openMarkdown', (e, filepath, dicpath) => {
    openMarkdown(filepath, dicpath)

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
