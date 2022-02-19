var equation = []
var answer= ''

function getData(calcChar){
  if(equation[0] == 0) equation.shift()
  if(['+', '-', '/', '*', '^'].includes(equation.at(-1)) &&
     ['+', '-', '/', '*', '^'].includes(calcChar)) return
  
  equation.push(calcChar)
  
  if(calcChar == 'clear') equation = ['0']
  
  document.getElementById('display-cell').innerText = equation.join('')
}

function equals(){
  answer = eval(equation.map(a =>{
    if(a != '^') return a
    else return '**'
  }).join(''))
  document.getElementById('display-cell').innerText = Math.round(answer*1000)/1000
}
