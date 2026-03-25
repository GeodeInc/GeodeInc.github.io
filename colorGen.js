const lockedDivs = [false, false, false, false, false];
const colorDivs = document.querySelectorAll(".color");
const lockBtns = document.querySelectorAll(".lockBtn");
const hexDisplays = document.querySelectorAll(".hex");

lockBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    lockedDivs[i] = !lockedDivs[i];
    btn.innerText = lockedDivs[i] ? 'lock' : 'lock_open';
  });
});

hexDisplays.forEach(hexDiv => {
  hexDiv.addEventListener("click", () => {
    copyToClipboard(hexDiv.innerText);
  });
});

document.addEventListener("keydown", e => {
  if(e.code === "Space") {
    e.preventDefault();
    updateColors(generateColors(5));
  }
});

window.addEventListener("load", () => {
  const hashColors = window.location.hash ? window.location.hash.slice(1).split("-") : generateColors(5);
  updateColors(hashColors);
});

function generateColors(count) {
  const colors = [];
  for(let i = 0; i < count; i++) {
    colors.push(rgbToHex(randInt(0,255), randInt(0,255), randInt(0,255)));
  }
  return colors;
}

function updateColors(colors) {
  const newColors = [];

  colors.forEach((color, i) => {
    const hex = color.startsWith('#') ? color : '#' + color;
    if(!lockedDivs[i]) {
      colorDivs[i].style.backgroundColor = hex;
      hexDisplays[i].innerText = hex;
    }
    const rgb = colorDivs[i].style.backgroundColor.slice(4, -1).split(", ").map(Number);
    newColors.push(rgbToHex(...rgb));
  });

  hexDisplays.forEach((hexDiv, i) => {
    const invert = invertColor(newColors[i]);
    hexDiv.style.color = lockBtns[i].style.color = invert;
  });

  const newURL = new URL("/colorgenerator/" + newColors.join("-"), window.location.origin);
  window.history.pushState(null, null, newURL.href);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function rgbToHex(r,g,b) {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res ? { r: parseInt(res[1],16), g: parseInt(res[2],16), b: parseInt(res[3],16) } : null;
}

function invertColor(hex) {
  const rgb = hexToRgb(hex);
  return `rgb(${255-rgb.r}, ${255-rgb.g}, ${255-rgb.b})`;
}

function copyToClipboard(text) {
  if(navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = textarea.style.left = 0;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}
