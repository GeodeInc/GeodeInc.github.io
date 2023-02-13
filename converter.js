var answerBox = document.getElementById('ans')
var option = document.getElementById('select')
var usrInput = document.getElementById('usrInput')

function binaryToDecimal(input) {
    if (parseInt(input[input.length - 1]) == 1 | parseInt(input[input.length - 1]) == 0){
        var binary, i, z, j
        j = 0
        binary = [...input]
        i = binary.length - 1
        z = 0
        for (i; i >= 0; i--) {
            z += (parseInt(binary[j]) * Math.pow(2, i))
            j++
        }
        return z
    }
    else {
        return 'please only use binary'
    }
    }


function decimalToBinary(input) {
    if (parseInt(input) >= 1) {
        var i = 0
        var string = ''
        input = parseInt(input)
        var tempInput = input
        for (z = input; z > 1;) {
                z = z / 2
            if (z >= 1) {
                i++
            }
        }
        for (i; i >= 0; i--) {
            if (input - (Math.pow(2, i)) >= 0) {
                input = input - (Math.pow(2, i))
                string += '1'
            }
            else if (input - Math.pow(2,i) < 0){
                string +='0'
            }
        }
        return string
    }
}

function run(){
    if (option.value == '1') {
        
       answerBox.value = binaryToDecimal(usrInput.value)
    }
    if (option.value == '2') {
        answerBox.value = decimalToBinary(usrInput.value)
    }

}
 