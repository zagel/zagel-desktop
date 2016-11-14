const { app, BrowserWindow, crashReporter } = require('electron')
const path = require('path')
const url = require('url')
const env = require('./env')

// Report crashes to our server.
// crashReporter.start()

let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 900, height: 600 })

  // and load the index.html of the app.
  win.loadURL(url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, 'app.html'),
    query: { env },
  }))

  // Open the DevTools.
  if (env === 'development') {
    win.webContents.openDevTools()
  }

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => app.quit())
