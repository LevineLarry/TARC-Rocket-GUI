const electron = require("electron")
const {app, BrowserWindow, ipcMain} = require("electron")

let win

function createWindow()
{
  win = new BrowserWindow({
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile("index.html")
  win.once("ready-to-show", () => {
    win.maximize()
    win.show()
  })
  win.webContents.openDevTools()
}

ipcMain.on("asynchronous-message", (event, arg) => {
  switch(arg.command) {
    case "maximize":
      win.maximize()
      break
    case "minimize":
      win.minimize()
      break
    case "exit":
      app.quit()
      break
  }
})

app.on("ready", createWindow)