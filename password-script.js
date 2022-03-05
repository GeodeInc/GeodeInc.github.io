function passGen() {
    var leng = document.getElementById('length').value
    if (leng === "") return
    let pass = 'Password:\n'
    let color = randRGB()
    passwordYasss.style.color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
  
    while (leng > 0) {
      pass = pass + String.fromCharCode(random(33, 126))
      leng--
    }
    document.getElementById("passwordYasss").innerText = pass
  }
  function random(min, max) { return Math.floor(Math.random() * (max - min)) + min } //gets a random number with the parameters min max 

function randRGB() { //returns a list of random numbers using the random function
  return [
    random(0, 255),
    random(0, 255),
    random(0, 255)
  ]
}