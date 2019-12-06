//const jquery = require("jquery")

function showDropdown(element) {
  $(element).next().toggle("show")
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      $(openDropdown).hide("show")
    }
  }
}