var equation = document.getElementById('newEq');
var midpoint = document.getElementById('midPoint');
var endpoint = document.getElementById('endPoint');
var labels = document.getElementsByClassName('label');

var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt);

function calculate() {
  labels[0].style.color = 'black';
  labels[1].style.color = 'black';
  labels[2].style.color = 'black';

  var slopeInput = document.getElementById('slope').value;
  var yInt = parseFloat(document.getElementById('yInt').value);
  var x1 = parseFloat(document.getElementById('pointx').value);
  var y1 = parseFloat(document.getElementById('pointy').value);

  if (!slopeInput || isNaN(yInt) || isNaN(x1) || isNaN(y1)) return;

  var slopeY, slopeX;
  if (slopeInput.includes('/')) {
    var parts = slopeInput.split('/');
    slopeY = parseFloat(parts[0]);
    slopeX = parseFloat(parts[1]);
  } else {
    slopeY = parseFloat(slopeInput);
    slopeX = 1;
  }

  var originalSlope = slopeY / slopeX;
  var newSlope = -slopeX / slopeY;
  var newYInt = y1 - newSlope * x1;

  var MPx = (yInt - newYInt) / (newSlope - originalSlope);
  var MPy = originalSlope * MPx + yInt;

  MPx = Math.round(MPx * 1000) / 1000;
  MPy = Math.round(MPy * 1000) / 1000;

  midpoint.innerText = `(${MPx}, ${MPy})`;
  equation.innerText = `y=${newSlope}x+${newYInt}`;

  var x2 = Math.round((2 * MPx - x1) * 1000) / 1000;
  var y2 = Math.round((2 * MPy - y1) * 1000) / 1000;
  endpoint.innerText = `(${x2}, ${y2})`;

  desmosGraph(originalSlope, yInt, newSlope, newYInt, x1, y1, MPx, MPy, x2, y2);
}

function desmosGraph(originalSlope, yInt, newSlope, newYInt, x1, y1, MPx, MPy, x2, y2) {
  calculator.setExpression({ id: 'original', latex: `y=${originalSlope}x+${yInt}` });
  calculator.setExpression({ id: 'perpendicular', latex: `y=${newSlope}x+${newYInt}` });
  calculator.setExpression({ id: 'point1', latex: `(${x1},${y1})`, color: Desmos.Colors.BLUE });
  calculator.setExpression({ id: 'midPoint', latex: `(${MPx},${MPy})`, color: Desmos.Colors.GREEN });
  calculator.setExpression({ id: 'endPoint', latex: `(${x2},${y2})`, color: Desmos.Colors.RED });
}
