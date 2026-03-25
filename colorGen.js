const lockedDivs = [false, false, false, false, false];
const colorDivs = document.querySelectorAll(".color");
const lockBtns = document.querySelectorAll(".lockBtn");
const hexDisplays = document.querySelectorAll(".hex");

// Lock/unlock functionality
lockBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    lockedDivs[i] = !lockedDivs[i];
    btn.innerText = lockedDivs[i] ? 'lock' : 'lock_open';
  });
});

// Click-to-copy hex
hexDisplays.forEach(hexDiv => {
  hexDiv.addEventListener("click", () => {
    copyToClipboard(hexDiv.innerText);
  });
});

// Spacebar regenerates palette
document.addEventListener("keydown", e => {
  if(e.code === "Space") {
    e.preventDefault();
    updateColors(generateComplementaryPalette(colorDivs[0].style.backgroundColor || randomHex()));
  }
});

// Initialize on load
window.addEventListener("load", () => {
  const hashColors = window.location.hash ? window.location.hash.slice(1).split("-") : generateComplementaryPalette(randomHex());
  updateColors(hashColors);
});

// Generate a random hex color
function randomHex() {
  return rgbToHex(randInt(0,255), randInt(0,255), randInt(0,255));
}

// Generate 5-color complementary palette
function generateComplementaryPalette(baseHex) {
  // Convert baseHex to HSL
  const rgb = hexToRgb(baseHex);
  const r = rgb.r/255, g = rgb.g/255, b = rgb.b/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max + min)/2;

  if(max === min) h = s = 0;
  else {
    const d = max - min;
    s = l > 0.5 ? d/(2 - max - min) : d/(max + min);
    switch(max){
      case r: h = (g - b)/d + (g < b ? 6 : 0); break;
      case g: h = (b - r)/d + 2; break;
      case b: h = (r - g)/d + 4; break;
    }
    h *= 60;
  }
  s *= 100; l *= 100;

  const colors = [];
  colors.push(baseHex); // base
  colors.push(rgbToHex(...hslToRgb((h + 180)%360, s, l))); // complementary
  colors.push(rgbToHex(...hslToRgb((h + 30)%360, s, l))); // analogous +
  colors.push(rgbToHex(...hslToRgb((h - 30 + 360)%360, s, l))); // analogous -
  colors.push(rgbToHex(...hslToRgb((h + 120)%360, s, l))); // triadic
  return colors;
}

// Update colors and invert text/locks
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

// Utility functions
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h/30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(Math.min(k(n)-3, 9-k(n), 1), -1);
  return [Math.round(f(0)*255), Math.round(f(8)*255), Math.round(f(4)*255)];
}

function rgbToHex(r,g,b) {
  return "#" + ((1 << 24) + (r <<16) + (g <<8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res ? {r:parseInt(res[1],16), g:parseInt(res[2],16), b:parseInt(res[3],16)} : null;
}

function invertColor(hex) {
  const rgb = hexToRgb(hex);
  return `rgb(${255-rgb.r}, ${255-rgb.g}, ${255-rgb.b})`;
}

function copyToClipboard(text) {
  if(navigator.clipboard) navigator.clipboard.writeText(text);
  else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = textarea.style.left = 0;
    document.body.appendChild(textarea);
    textarea.focus(); textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}
