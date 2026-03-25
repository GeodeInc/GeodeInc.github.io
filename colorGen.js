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
  if (e.code === "Space") {
    e.preventDefault();
    updateColors(generatePalette(randomHex()));
  }
});

window.addEventListener("load", () => {
  const hash = window.location.hash.slice(1);
  let initialColors;

  if (hash) {
    initialColors = hash.split("-").map(c => c.startsWith("#") ? c : "#" + c);
  } else {
    initialColors = generatePalette(randomHex());
  }

  updateColors(initialColors);
});

function randomHex() {
  return rgbToHex(randInt(0, 255), randInt(0, 255), randInt(0, 255));
}

function generatePalette(baseHex) {
  const rgb = hexToRgb(baseHex);
  let [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Normalize base to a reasonable, vibrant range
  s = clamp(s, 45, 80);
  l = clamp(l, 30, 60);

  // Pick a random harmony scheme
  const schemes = [
    'complementary',
    'split-complementary',
    'triadic',
    'tetradic',
    'analogous',
  ];
  const scheme = schemes[randInt(0, schemes.length - 1)];

  let hues;
  switch (scheme) {
    case 'complementary':
      // Two poles + subtle shifts around each
      hues = [h, (h + 180) % 360, (h + 20) % 360, (h + 200) % 360, (h + 160) % 360];
      break;
    case 'split-complementary':
      // Base + two colors adjacent to its complement
      hues = [h, (h + 150) % 360, (h + 210) % 360, (h + 30) % 360, (h + 330) % 360];
      break;
    case 'triadic':
      // Three evenly spaced + two bridging
      hues = [h, (h + 120) % 360, (h + 240) % 360, (h + 60) % 360, (h + 300) % 360];
      break;
    case 'tetradic':
      // Four corners of the color wheel
      hues = [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360, (h + 45) % 360];
      break;
    case 'analogous':
      // Neighboring hues — very harmonious
      hues = [h, (h + 30) % 360, (h + 60) % 360, (h - 30 + 360) % 360, (h - 60 + 360) % 360];
      break;
  }

  // Each color gets slight L and S variation so they're not all clones
  const lShifts = [0, -12, +12, -6, +6];
  const sShifts = [0, +10, -10, +5, -5];

  return hues.map((hue, i) => {
    const finalL = clamp(l + lShifts[i], 20, 75);
    const finalS = clamp(s + sShifts[i], 30, 90);
    return rgbToHex(...hslToRgb(hue, finalS, finalL));
  });
}

function updateColors(colors) {
  const newColors = [];

  colors.forEach((color, i) => {
    const hex = color.startsWith('#') ? color : '#' + color;

    if (!lockedDivs[i]) {
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

  window.history.replaceState(null, null, "#" + newColors.map(c => c.replace("#", "")).join("-"));
}

// Utility functions
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [h, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function rgbToHex(r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }

function hexToRgb(hex) {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res ? { r: parseInt(res[1], 16), g: parseInt(res[2], 16), b: parseInt(res[3], 16) } : null;
}

function invertColor(hex) {
  const rgb = hexToRgb(hex);
  return `rgb(${255 - rgb.r}, ${255 - rgb.g}, ${255 - rgb.b})`;
}

function copyToClipboard(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text);
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
