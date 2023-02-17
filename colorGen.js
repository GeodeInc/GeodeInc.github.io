//Variables 
var lockedDivs = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false
};

//Selectors
var colorDiv       = document.querySelectorAll(".color");
var lockBtns       = document.querySelectorAll(".lockBtn");
var hexCodeDisplay = document.querySelectorAll(".hex");

//Event Listeners
 

//When you click on any lockBtn it flips the lockedDivs value and switches the innerText
lockBtns.forEach((lockBtn, index) => {
  lockBtn.onclick = () => { 
    lockedDivs[index] = !lockedDivs[index]; 
    
    if(lockedDivs[index] == true) {
      lockBtn.innerText = 'lock';
    } else {
      lockBtn.innerText = 'lock_open';
    }
  }
})

//Adds an onclick to each hexDiv that when clicked copys the text
hexCodeDisplay.forEach(hexDiv => {
  hexDiv.onclick = () => {
    copyTextToClipboard(hexDiv.innerText);
  }
})

//Redoes all the colors when the space bar is pressed 
document.addEventListener("keydown", event => {
  if (event.code === "Space") {
    updateDivColors(generateColors(5));
  }
})

//Generates initial colors onload or uses already supplied colors
document.body.onload = () => {
  updateDivColors(window.location.hash ? window.location.hash.split("-") : generateColors(5));
}

//Generates a random color
var generateColors = (numberOfColors) => {
  var colors = [];
  for(let i=0; i < numberOfColors; i++){
    colors.push(rgbToHex(randint(0, 255), randint(0, 255), randint(0, 255)));
  }
  return colors;
}

//changes the color and dispaly hex code of the divs and keeps any locked divs the same
var updateDivColors = (colors) => {
  var newColors = []
  
  //runs for all the supplied colors
  colors.forEach((item, index, list) => {
    item = "#" + item
    
    //if it isnt locked it updates the colors and hex display
    if(!lockedDivs[index]) colorDiv[index].style.backgroundColor = hexCodeDisplay[index].innerText = item;
    
    //appends the current div color to new Colors and converts it to hex
    newColors.push(
      rgbToHex(
        ...colorDiv[index].style.backgroundColor
          .slice(4, -1)
          .split(", ")
          .map(digit => { return Number(digit) })
      )
    )
  });
  
  //changes the color for the text and lock
  hexCodeDisplay.forEach((hexDiv, i) => {
    hexDiv.style.color = lockBtns[i].style.color = invertColor(newColors[i]);
  })
  
  //changes the url
  var newURL = new URL("/colorgenerator/" + newColors.join("-"), window.location.origin);
  window.history.pushState(null, null, newURL.href)
}

//generates a random number with given min and max values
var randint = (min, max) => { return Math.floor(Math.random() * (max - min + 1) + min); };

//converts the given rgb values to hex
var rgbToHex = (r, g, b) => { 
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); 
}

//converts the given hex to rgb
var hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

//copies given text to clipboard
function copyTextToClipboard(text) {
    if (!navigator.clipboard){
        var textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try { document.execCommand('copy'); } catch(err){ console.log("didnt work") } 
        document.body.removeChild(textArea);
        return;
    }
    
    navigator.clipboard.writeText(text);
}

//Inverts a given hex value
function invertColor(hex){
    var fontColor = hexToRgb(hex);
    var oppositeColor =  [255 - fontColor.r, 255 - fontColor.g, 255 - fontColor.b ];
    return `rgb(${oppositeColor[0]}, ${oppositeColor[1]}, ${oppositeColor[2]})`;
}
