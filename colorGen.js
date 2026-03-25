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
    updateColors(generatePalette());
  }
});

window.addEventListener("load", () => {
  const hash = window.location.hash.slice(1);
  let initialColors;
  if (hash) {
    initialColors = hash.split("-").map(c => c.startsWith("#") ? c : "#" + c);
  } else {
    initialColors = generatePalette();
  }
  updateColors(initialColors);
});

// ---------------------------------------------------------------------------
// OKLCH palette generation
// ---------------------------------------------------------------------------

const GOLDEN_ANGLE = 137.508;

function generatePalette() {
  // Random starting hue, mid chroma, mid lightness
  const baseH = Math.random() * 360;
  const baseC = 0.06 + Math.random() * 0.08;  // 0.06–0.14 — muted to mid
  const baseL = 0.38 + Math.random() * 0.22;  // 0.38–0.60 — never too dark/light

  // Five lightness targets spread across the range, shuffled for variety
  const lTargets = shuffleArray([0.20, 0.38, 0.55, 0.70, 0.85]);

  // Each color steps hue by the golden angle — mathematically guaranteed
  // to never cluster or repeat
  return lTargets.map((l, i) => {
    const h = (baseH + GOLDEN_ANGLE * i) % 360;

    // Lower chroma at extremes (very dark / very light) — mimics real pigment
    const chromaScale = 1 - Math.abs(l - 0.52) * 1.2;
    const c = Math.max(0.01, baseC * chromaScale);

    const rgb = oklchToRgb(l, c, h);
    return rgbToHex(...rgb);
  });
}

// ---------------------------------------------------------------------------
// OKLCH → sRGB conversion (full pipeline)
// ---------------------------------------------------------------------------

function oklchToRgb(l, c, h) {
  // 1. OKLCH → OKLab
  const hRad = h * Math.PI / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // 2. OKLab → Linear sRGB (via XYZ-D65)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const lc = l_ * l_ * l_;
  const mc = m_ * m_ * m_;
  const sc = s_ * s_ * s_;

  let r =  4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  let g = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  let bv = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc;

  // 3. Gamut clamp then linear → gamma
  r = linearToGamma(clamp(r, 0, 1));
  g = linearToGamma(clamp(g, 0, 1));
  bv = linearToGamma(clamp(bv, 0, 1));

  return [Math.round(r * 255), Math.round(g * 255), Math.round(bv * 255)];
}

function linearToGamma(v) {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

// ---------------------------------------------------------------------------
// Update DOM
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
