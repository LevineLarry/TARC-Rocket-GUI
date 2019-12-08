const electron = require("electron")
const {app, BrowserWindow, ipcMain} = require("electron")
var WiFiControl = require("wifi-control")

let win, networks, selectedNetwork = "none"

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

function scanNetworks(event) {
  WiFiControl.scanForWiFi( function(err, response) {
    if (err) console.log(err);
    else {
      networks = response.networks
      let ifacestate = WiFiControl.getIfaceState()
      for(i in networks)
      {
        if(selectedNetwork != "none" && networks[i].ssid == selectedNetwork.ssid && ifacestate.connection == "connected")
        {
          selectedNetwork = networks[i]
          event.sender.send("asynchronous-message", 
          {
            title: "signalStrength", 
            strength: selectedNetwork.signal_level,
            connected: true
          })
        } else if(ifacestate.connection == "disconnected")
        {
          event.sender.send("asynchronous-message", 
          {
            title: "signalStrength", 
            strength: selectedNetwork.signal_level,
            connected: false
          })
        }
      }
    }
  })
}

function setupWifi(event) {
  WiFiControl.init({
    debug: true
  })
  setInterval(function(){ scanNetworks(event) }, 1000)
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
    case "connectToNetwork":
      let pass = "7032169537"
      let results = WiFiControl.connectToAP({ssid: arg.ssid, password: pass}, (err, response) => {
        if(err) {
          console.log(err)
          event.sender.send("asynchronous-message", 
          {
            title: "connectToNetwork-Fail"
          })
        }
        else {
          event.sender.send("asynchronous-message", 
          {
            title: "connectToNetwork-Success"
          })
          for(i in networks)
          {
            if(networks[i].ssid == arg.ssid)
            {
              selectedNetwork = networks[i]
            }
          }
        }
      })
      break
  }
})

app.on("ready", createWindow)