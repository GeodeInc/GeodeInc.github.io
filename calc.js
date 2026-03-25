var slope = '';
var yInt = '';
var pointX = '';
var pointY = '';
var newSlope = '';
var newYInt = '';
var x1 = '';
var y1 = '';
var x2 = '';
var y2 = '';
var MPx = '';
var MPy = '';
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
  if(document.getElementById('slope').value =='' || document.getElementById('yInt').value =='' || document.getElementById('pointx').value ==''||document.getElementById('pointy').value ==''){
    return
  }

  slope = document.getElementById('slope').value;
  yInt = parseFloat(document.getElementById('yInt').value);
  x1 = parseFloat(document.getElementById('pointx').value);
  y1 = parseFloat(document.getElementById('pointy').value);

  slope = slope.split('/');
  if(slope.length !=2) slope.push('1');

  var slopeY = parseFloat(slope[0]);
  var slopeX = parseFloat(slope[1]);

  var originalSlope = Math.round((slopeY/slopeX)*1000)/1000;
  newSlope = Math.round((-slopeX/slopeY)*1000)/1000;
  newYInt = Math.round((y1 - (newSlope * x1))*1000)/1000;

  MPx = (yInt - newYInt) / (newSlope - originalSlope);
  MPy = (originalSlope * MPx) + yInt;
  MPx = Math.round(MPx*1000)/1000;
  MPy = Math.round(MPy*1000)/1000;

  midpoint.innerText = '('+MPx+', '+MPy+')';
  equation.innerText = 'y='+newSlope+'x+'+newYInt;

  x2 = Math.round((2*MPx - x1)*1000)/1000;
  y2 = Math.round((2*MPy - y1)*1000)/1000;
  endpoint.innerText = '('+x2+', '+y2+')';

  desmosGraph();
}

function desmosGraph() {
  calculator.setExpression({ id: 'original', latex: 'y='+originalSlope+'x+'+yInt });
  calculator.setExpression({ id: 'perpendicular', latex: 'y='+newSlope+'x+'+newYInt });
  calculator.setExpression({ id: 'point1', latex: '('+x1+','+y1+')', color: Desmos.Colors.BLUE });
  calculator.setExpression({ id: 'midPoint', latex: '('+MPx+','+MPy+')', color: Desmos.Colors.GREEN });
  calculator.setExpression({ id: 'endPoint', latex: '('+x2+','+y2+')', color: Desmos.Colors.RED });
}
