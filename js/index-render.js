var {ipcRenderer} = require("electron")
var networks, selectedNetwork

$(".connect-btn").click(() => {
  $(".modal").css("display", "flex")
  getNetworks()
})

$(".network-select").click((e) => {
  selectedNetwork = $(e.target)[0].innerHTML
  $("#connectivityLabel").html(selectedNetwork)
  $(".modal").css("display", "none")
  connectToNetwork()
})

function getNetworks()
{
  ipcRenderer.send("asynchronous-message", {
    command: "getNetworks"
  })
}

function populateNetworks()
{
  $(".network-select").empty()
  for(i in networks)
  {
    let network = networks[i]
    networks.push(network)
    let row = `<div class='network-select-row'>${network.ssid}</div>`
    $(".network-select").append(row)
  }
}

ipcRenderer.on("asynchronous-message", (event, arg) => {
  switch(arg.title)
  {
    case "getNetworks-Response":
      networks = arg.networks
      populateNetworks()
  }
});