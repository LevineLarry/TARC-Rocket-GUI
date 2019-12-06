//const jquery = require("jquery")

function showDropdown(element) {
  console.log($(element).next())
  $(element).next().toggle("show")
}