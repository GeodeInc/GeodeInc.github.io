var slope ='';
var yInt='';
var point1='';
var newSlope=''
var x1 =''
var y1 =''
var newYInt = ''
var x2 =''
var y2 =''
var testYInt =''
var equation = document.getElementById('newEq')
var midpoint=document.getElementById('midPoint')
var endpoint = document.getElementById('endPoint')
var labels = document.getElementsByClassName('label')
var slopeX =''
var slopeY=''
var testSlopeX=''
var testSlopeY =''

function calculate() {
  labels[0].style.color = 'black';
  labels[1].style.color = 'black';
  labels[2].style.color = 'black';
  if(document.getElementById('slope').value =='' || document.getElementById('yInt').value =='' || document.getElementById('point1').value ==''){
    return
  }
  slope = document.getElementById('slope').value
  yInt = document.getElementById('yInt').value
  testYInt = yInt.replace('-', '')
  if(testYInt!=yInt){
    yInt = testYInt*-1
  }
  yInt = parseFloat(yInt)
  point1 = document.getElementById('point1').value
  slope = slope.split('/')
  if(slope.length !=2){
    slope = slope + [1]
  }
  slopeY = slope[0]
  slopeX = slope[1]
 
  testY = slopeY.replace('-', '')
  if(testY!=slopeY){
    slopeY = testY*-1
  }
  testX = slopeX.replace('-', '')
  if(testX!=slopeX){
    slopeX = testX*-1
  }
  
  slopeY = parseFloat(slopeY)
  slopeX = parseFloat(slopeX)

  
  newSlope = Math.round((slopeX/slopeY)*-1*1000)/1000
  point1 = point1.split(/(?:, |,)+/)
  x1 = point1[0]
  y1 = point1[1]
  slope = Math.round((slopeY/slopeX)*1000)/1000
  newYInt = Math.round((y1 - (newSlope * x1))*1000)/1000

  MPx = (yInt - newYInt) / (newSlope - slope)

  MPy = (slope * MPx) + yInt
  console.log(slope, MPx, yInt)
  MPx = Math.round(MPx*1000)/1000
  MPy = Math.round(MPy*1000)/1000
  midpoint.innerText = '('+MPx+', '+MPy+')'
  equation.innerText = ' y = ' + newSlope + 'x + '+ newYInt
  x2 = (2*MPx) - x1;
  y2 = (2*MPy) - y1; 

  x2 = Math.round(x2*1000)/1000
  y2 = Math.round(y2*1000)/1000
  slope = Math.round(slope*1000)/1000
 
  endpoint.innerText = '('+x2+', '+y2+')'
  desmosGraph()
}

var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt);





function desmosGraph(){
  
  calculator.setExpression({ id: 'original', latex: 'y= '+slope+'x +'+yInt });
  calculator.setExpression({ id: 'perpendicular', latex: equation.innerText });
  calculator.setExpression({ id: 'endPoint', latex: endpoint.innerText });
  calculator.setExpression({ id: 'midPoint', latex: midpoint.innerText });
  calculator.setExpression({ id: 'point1', latex: '('+x1 + ","+ y1 +")"});
}

