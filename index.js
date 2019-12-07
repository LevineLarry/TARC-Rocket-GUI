const electron = require("electron")
const {app, BrowserWindow, ipcMain} = require("electron")
var WiFiControl = require("wifi-control")

let win, networks

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

function setupWifi(event) {
  WiFiControl.init({
    debug: true
  })
  WiFiControl.scanForWiFi( function(err, response) {
    if (err) console.log(err);
    else {
      networks = response.networks
      event.sender.send("asynchronous-message", 
      {
        title: "getNetworks-Response", 
        networks: networks
      })
    }
  })
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
    case "getNetworks":
      setupWifi(event)
  }
})

app.on("ready", createWindow)