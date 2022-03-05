var todoListTrack = 20
function addToList() {
  var li = document.createElement("li") //creates an empty list 
  let color = randRGB() //sets a variable color to the list of random numbers
  li.style.color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`//uses the values from the list to change the color of the text
  var inputValue = document.getElementById("input").value //Sets a variable to the input from the text box
  var text = document.createTextNode(inputValue)//sets the inputValue to a string

  li.appendChild(text)//adds to the end of the list

  if (inputValue != "") {//if the input is blank it wont do anything 
    var list = document.getElementById("peen lol")
    var span = document.createElement("SPAN");
    var text = document.createTextNode("\t \u00D7");
    span.className = "close";
    span.appendChild(text);
    li.appendChild(span);

    var close = document.getElementsByClassName("close");
    var i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        var div = this.parentElement;
        div.style.display = "none";


      }
    }

    if (todoListTrack === 10) todoListTrack = 0
    else if (todoListTrack > 9) {
      list.appendChild(li)
      return todoListTrack--


    }
    list.replaceChild(li, list.childNodes[todoListTrack])
    todoListTrack++
  }

}



function random(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min } //gets a random number with the parameters min max 

function randRGB() { //returns a list of random numbers using the random function
  return [
    random(0, 255),
    random(0, 255),
    random(0, 255)
  ]
}