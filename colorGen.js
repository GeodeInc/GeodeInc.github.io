
//Variables 
var div = '';
var hexDiv = document.querySelectorAll(".hex");


//Event Listeners
document.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    div = document.querySelectorAll(".color");
    generateColors(5).forEach((item, index, list) => {
      div[index].style.backgroundColor = item
      hexDiv[index].innerText = item
      hexVal += item + '-'
    })
    window.history.replaceState(null, document.title, 'https://geodeinc.me' + hexVal)
    hexVal=''
  }
})

//Functions
var generateColors = (numberOfColors) => {
  var colors = [];
  for(let i=0; i<numberOfColors; i++){
    colors.push(rgbToHex(randint(0, 255), randint(0, 255), randint(0, 255)));
  }
  return colors
}
var hexVal=''
var randint = (min, max) => { return Math.floor(Math.random() * (max - min + 1) + min); }

var rgbToHex = (r, g, b) => { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }
function load (){
      div = document.querySelectorAll(".color");
      generateColors(5).forEach((item, index, list) => {
      div[index].style.backgroundColor = item
      hexDiv[index].innerText = item
      hexVal +=item + '-'
    })
     window.history.replaceState(null, document.title, 'https://geodeinc.me' + hexVal)
    hexVal=''
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard){
        var textArea = document.createElement("textarea");
        textArea.value = text.innerText;
        textArea.style.top = textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try { document.execCommand('copy'); } catch(err){ console.log("didnt work") } 
        document.body.removeChild(textArea);
        return
    }
    
    navigator.clipboard.writeText(text.innerText)
}


