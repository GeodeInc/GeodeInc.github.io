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
// Palette generation
// ---------------------------------------------------------------------------

function generatePalette() {
  const baseH = Math.random() * 360;

  // Chroma: keep it low-to-mid so colors are usable, not neon
  const baseC = 0.05 + Math.random() * 0.10;

  // Randomly pick one of three cohesive palette structures
  const roll = Math.random();

  if (roll < 0.4) {
    // SHADES — all one hue, lightness spread from dark to light
    // Most classic Coolors-style palette
    return shadesOf(baseH, baseC);

  } else if (roll < 0.7) {
    // ANALOGOUS + SHADES — two close hues, one gets shades the other is accent
    const accentH = (baseH + (Math.random() < 0.5 ? 1 : -1) * (25 + Math.random() * 20)) % 360;
    return analogousWithAccent(baseH, baseC, accentH);

  } else {
    // TONAL SHIFT — same hue family, but chroma drifts (muted → vivid → muted)
    // Feels very interior design / editorial
    return tonalShift(baseH, baseC);
  }
}

// All 5 colors share one hue — lightness evenly spread, chroma tapers at extremes
function shadesOf(h, baseC) {
  const lightStops = [0.18, 0.34, 0.52, 0.68, 0.84];

  // Shuffle so dark isn't always on the left
  const stops = shuffleArray([...lightStops]);

  return stops.map(l => {
    // Chroma peaks in the midtones, fades toward dark and light
    const chromaScale = 1 - Math.pow((l - 0.52) / 0.52, 2);
    const c = Math.max(0.015, baseC * chromaScale);
    return rgbToHex(...oklchToRgb(l, c, h));
  });
}

// 4 shades of base hue + 1 analogous accent dropped in at a random position
function analogousWithAccent(h, baseC, accentH) {
  const lightStops = [0.20, 0.40, 0.60, 0.78];
  const accentL = 0.45 + Math.random() * 0.15;
  const accentC = baseC * 1.1;

  const shades = shuffleArray([...lightStops]).map(l => {
    const chromaScale = 1 - Math.pow((l - 0.50) / 0.50, 2);
    const c = Math.max(0.015, baseC * chromaScale);
    return rgbToHex(...oklchToRgb(l, c, h));
  });

  // Insert accent at a random index
  const accentColor = rgbToHex(...oklchToRgb(accentL, accentC, accentH));
  const insertAt = randInt(0, 4);
  shades.splice(insertAt, 0, accentColor);
  return shades.slice(0, 5);
}

// Same hue, lightness mid-range, chroma varies — feels paint-chip / editorial
function tonalShift(h, baseC) {
  const lightStops = [0.25, 0.38, 0.52, 0.65, 0.78];
  const chromaStops = [0.4, 0.8, 1.0, 0.7, 0.3]; // peaks in the middle

  const indices = shuffleArray([0, 1, 2, 3, 4]);

  return indices.map(i => {
    const l = lightStops[i];
    const c = Math.max(0.01, baseC * chromaStops[i]);
    // Tiny hue nudge per step — barely perceptible but adds warmth/coolness
    const hNudge = (h + i * 4) % 360;
    return rgbToHex(...oklchToRgb(l, c, hNudge));
  });
}

// ---------------------------------------------------------------------------
// OKLCH → sRGB
// ---------------------------------------------------------------------------

function oklchToRgb(l, c, h) {
  const hRad = h * Math.PI / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const lc = l_ * l_ * l_;
  const mc = m_ * m_ * m_;
  const sc = s_ * s_ * s_;

  let r  =  4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  let g  = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  let bv = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc;

  return [
    Math.round(linearToGamma(clamp(r,  0, 1)) * 255),
    Math.round(linearToGamma(clamp(g,  0, 1)) * 255),
    Math.round(linearToGamma(clamp(bv, 0, 1)) * 255),
  ];
}

function linearToGamma(v) {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

// ---------------------------------------------------------------------------
// DOM update
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
