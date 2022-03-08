var iconMode = document.getElementById("light-dark_mode")
var header = document.getElementById("header")
var img = document.getElementById("logo")
var bug = document.getElementById("bug")


function lightDarkMode(){
if(iconMode.innerHTML== 'light_mode'){
    iconMode.innerHTML= 'dark_mode'
    iconMode.style.color = 'white'
    document.body.style.backgroundColor = "#27213C"
    header.style.backgroundColor='#363946'
    img.src = 'Geodeinc-logos_white.png'
    bug.style.color = 'white'
}
else{
    iconMode.innerHTML= 'light_mode'
    iconMode.style.color='black'
    document.body.style.backgroundColor='#b1bca0'
    header.style.backgroundColor='#3A6A59'
    img.src = 'Geodeinc-logos_black.png'
    bug.style.color = 'black'
}
}
var projects = document.getElementById('projects')


//projects.addEventListener('mouseleave', ()=> {window.alert('mouse left')})
