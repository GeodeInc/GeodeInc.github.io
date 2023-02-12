var input = document.getElementById('display');

function equation(usrInput) {
    if (input.value.length == 0) {
        if (usrInput == '/' || usrInput == '*') {
            return;
        }
    }
    input.value += usrInput;
}

function solve() {
    input.value = eval(input.value);
}
