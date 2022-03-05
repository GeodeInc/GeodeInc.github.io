var iconMode = document.getElementById("light-dark_mode")
var header = document.getElementById("header")
var img = document.getElementById("logo")


function lightDarkMode(){
if(iconMode.innerHTML== 'light_mode'){
    iconMode.innerHTML= 'dark_mode'
    iconMode.style.color = 'white'
    document.body.style.backgroundColor = "black"
    header.style.backgroundColor='#363946'
    img.src = 'Geodeinc-logos_white.png'
}
else{
    iconMode.innerHTML= 'light_mode'
    iconMode.style.color='black'
    document.body.style.backgroundColor='#b1bca0'
    header.style.backgroundColor='#3A6A59'
    img.src = 'Geodeinc-logos_black.png'
}
}
var projects = document.getElementById('projects')


//projects.addEventListener('mouseleave', ()=> {window.alert('mouse left')})
