var {ipcRenderer} = require("electron")
const jquery = require("jquery")

$("#maximizebtn").click(function() {
  ipcRenderer.send("asynchronous-message", {
    command: "maximize"
  })
})

$("#minimizebtn").click(function() {
  ipcRenderer.send("asynchronous-message", {
    command: "minimize"
  })
})

$("#exitbtn").click(function() {
  ipcRenderer.send("asynchronous-message", {
    command: "exit"
  })
})