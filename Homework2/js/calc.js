const buttons = document.querySelectorAll('button');
const prevOpEl = document.querySelector('.input');
const currentOpEl = document.querySelector('.output');
const clearHistoryButton = document.querySelector('.clear-history');
const history = document.querySelector('.clear-history');

let prevOp;
let currOperation;
let operation;
let lastButton;
let lastButtonIndex;
let opResult;
let result = 0;
let historyList = [];
let repeatResult = false;
let equalHit = false;
let clean = false;

let clickedButton;
buttons.forEach(button => {
    button.addEventListener('click', () => {
        clickedButton = button.dataset.keyname;
        lastButtonIndex = currentOpEl.textContent.length - 1;
        lastButton = currentOpEl.textContent[lastButtonIndex];

        updateDisplay(clickedButton);
    })
});


function performCalc(value) {
    let currOperator = '+';

    value = value.split(' ');

    // Checks to see if there are repeat operation symbols
    for (let i = 0; i < value.length; i++) {
        
        if((value[i] === '*' || value[i] === '/' || value[i] === '+' || value[i] === '-' || value[i] === '=') && 
            (value[i + 1] === '' || value[i + 1] === ' ' || value[i + 1] === '=')) {
                let temp = value[i];
                value[i + 1] = value[i];
                value.splice(i + 1, 1);
                i--;
            } else if ((value[i] === '*' || value[i] === '/' || value[i] === '+' || value[i] === '-' || value[i] === '=' || value[i] === '' || value[i] === ' ') && 
            (value[i + 1] === '*' || value[i + 1] === '/' || value[i + 1] === '+' || value[i + 1] === '-' || value[i + 1] === '=' || value[i + 1] === '' || value[i + 1] === ' ')) {
                value[i] = value[i + 1];
                value.splice(i + 1, 1);
                i--;
            }
    }

    for (let i = 0; i < value.length - 1; i++) {
        const currTok = value[i];

        if (currTok === '*' || currTok === '/' || currTok === '+' || currTok === '-') {
            currOperator = currTok;
        } else if (currTok !== ' ') {
            const operand = parseFloat(currTok);

            switch (currOperator) {
                case '+':
                    result += operand;
                    break;
                case '-':
                    result -= operand;
                    break;
                case '*':
                    result *= operand;
                    break;
                case '/':
                    result /= operand;
                    break;
            }
        }
    }
    if (isNaN(result)) {
        result = 'Error';
    }
    return result;
}

let currOperand = '';
let operandCount = 0;

function updateDisplay(key) {
   
    if (opResult === 'Error') {
        if (key === 'C') {
            clearAll();
        }
        return;
    }
    
    if (clean === true) {
        currOperand = '';
        currentOpEl.textContent = "";
        clean = false;
    }

    if ((!isNaN(key) || key === '.') && equalHit === false) {
        currOperand += key;
        currentOpEl.textContent += key;
    } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '=') {
        if (key !== '=') {
            equalHit = false;
        }

        prevOpEl.textContent += `${currentOpEl.textContent} ${key}`;
        currentOpEl.textContent = " ";

        if (currOperand !== '' || key === '=') {
            operandCount++;
            if (operandCount === 2 && equalHit === false) {
                operandCount = 1;
                operation = prevOpEl.textContent + " ";

                if (repeatResult == false || key === '=') {
                    result = 0;
                    opResult = performCalc(operation);
                    repeatResult = true;
                    clean = true;
                } else {
                    currentOpEl.textContent = "";
                    result = 0;
                    opResult = performCalc(operation);
                    clean = true;
                }

                if (opResult === Infinity) {
                    opResult = 'Error';
                }
                currentOpEl.textContent = opResult;
                
                if (opResult != 'Error') {
                    historyList.push(opResult);
                    updateHistory();
                }
            }
        }
        if (key === '=') {
            equalHit = true;
        } else {
            currOperand = '';
        }
    }

    if (key === 'C') {
        clearAll();
    }
}


function updateHistory() {
    const histCont = document.querySelector('.historyContainer');
    histCont.innerHTML = '';

    historyList.forEach((entry, index) => {
        const listContent = document.createElement('li');
        listContent.textContent = entry;

        listContent.addEventListener('click', () => {
            clearAll();
            prevOpEl.textContent = entry;

            const clickedOp = entry;
            const clickedRes = performCalc(clickedOp);
            currentOpEl.textContent = clickedRes;
        });
        histCont.appendChild(listContent);
    });
}

function clearAll() {
    equalHit = false;
    clean = false;
    repeatResult = false;
    operandCount = 0;
    opResult = 0;
    lastButton = undefined;
    lastButtonIndex = undefined;
    currOperation = undefined;
    operation = undefined;
    prevOp = undefined;
    prevOpEl.textContent = "";
    currentOpEl.textContent = "";
}

document.addEventListener('keydown', (event) => {
    // Get the pressed key from the event
    const keyPressed = event.key;

    // Call the updateDisplay function with the pressed key
    updateDisplay(keyPressed);
});
 