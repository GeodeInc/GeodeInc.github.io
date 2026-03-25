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


const GOLDEN = 137.508;

const SCHEMES = {
  shades:    h => [h, h, h, h, h],
  analogous: h => [h, h, (h + 30) % 360, (h + GOLDEN) % 360, h],
  split:     h => [h, h, (h + 150) % 360, (h + 210) % 360, h],
  triadic:   h => [h, h, (h + 120) % 360, (h + 240) % 360, h],
};

const SCHEME_NAMES = Object.keys(SCHEMES);

const ROLES = [
  { s: [5,  18], b: [93, 99] },  // Background
  { s: [60, 85], b: [70, 95] },  // Primary
  { s: [25, 55], b: [72, 90] },  // Secondary
  { s: [60, 82], b: [55, 78] },  // Accent
  { s: [30, 55], b: [12, 28] },  // Text
];

function generatePalette() {
  const baseH  = Math.random() * 360;
  const scheme = SCHEME_NAMES[Math.floor(Math.random() * SCHEME_NAMES.length)];
  const hues   = SCHEMES[scheme](baseH);
  return hues.map((h, i) => hsbToHex(h, rf(ROLES[i].s[0], ROLES[i].s[1]), rf(ROLES[i].b[0], ROLES[i].b[1])));
}


function hsbToHex(h, s, b) {
  s /= 100; b /= 100;
  const k  = n => (n + h / 60) % 6;
  const f  = n => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  const r  = Math.round(f(5) * 255);
  const g  = Math.round(f(3) * 255);
  const bv = Math.round(f(1) * 255);
  return '#' + [r, g, bv].map(v => v.toString(16).padStart(2, '0')).join('');
}


function updateColors(colors) {
  const newColors = [];

  colors.forEach((color, i) => {
    const hex = color.startsWith('#') ? color : '#' + color;
    if (!lockedDivs[i]) {
      colorDivs[i].style.backgroundColor = hex;
      hexDisplays[i].innerText = hex;
    }
    const parts = colorDivs[i].style.backgroundColor.slice(4, -1).split(", ").map(Number);
    newColors.push(rgbToHex(...parts));
  });

  hexDisplays.forEach((hexDiv, i) => {
    const invert = invertColor(newColors[i]);
    hexDiv.style.color = lockBtns[i].style.color = invert;
  });

  window.history.replaceState(null, null, "#" + newColors.map(c => c.replace("#", "")).join("-"));
  document.querySelectorAll(".role")[i].style.color = invert;

}


function rf(a, b) { return a + Math.random() * (b - a); }

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex) {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res ? { r: parseInt(res[1], 16), g: parseInt(res[2], 16), b: parseInt(res[3], 16) } : null;
}

function invertColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
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
