// Scientific Calculator JavaScript
let display = document.getElementById('display');
let expression = document.getElementById('expression');
let currentInput = '0';
let currentExpression = '';
let operator = null;
let previousInput = null;
let memory = 0;
let isNewInput = true;
let isRadians = true; // true for radians, false for degrees

// Initialize calculator
function init() {
    updateDisplay();
    updateExpression();
}

// Update the main display
function updateDisplay() {
    display.textContent = currentInput;
}

// Update the expression display
function updateExpression() {
    expression.textContent = currentExpression;
}

// Append number or operator to display
function appendToDisplay(value) {
    if (isNewInput) {
        if (value === '.') {
            currentInput = '0.';
        } else if (value === '+' || value === '-' || value === '*' || value === '/') {
            if (operator && previousInput !== null) {
                calculate();
            }
            operator = value;
            previousInput = parseFloat(currentInput);
            currentExpression = currentInput + ' ' + value;
            currentInput = '0';
        } else {
            currentInput = value;
        }
        isNewInput = false;
    } else {
        if (value === '.') {
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
        } else if (value === '+' || value === '-' || value === '*' || value === '/') {
            if (operator && previousInput !== null) {
                calculate();
            }
            operator = value;
            previousInput = parseFloat(currentInput);
            currentExpression = currentInput + ' ' + value;
            currentInput = '0';
        } else {
            if (currentInput === '0') {
                currentInput = value;
            } else {
                currentInput += value;
            }
        }
    }
    updateDisplay();
    updateExpression();
}

// Calculate result
function calculate() {
    if (operator && previousInput !== null) {
        let result;
        const current = parseFloat(currentInput);
        
        switch (operator) {
            case '+':
                result = previousInput + current;
                break;
            case '-':
                result = previousInput - current;
                break;
            case '*':
                result = previousInput * current;
                break;
            case '/':
                if (current === 0) {
                    showError('Cannot divide by zero');
                    return;
                }
                result = previousInput / current;
                break;
        }
        
        currentExpression = previousInput + ' ' + operator + ' ' + current + ' =';
        currentInput = formatResult(result);
        operator = null;
        previousInput = null;
        isNewInput = true;
        updateDisplay();
        updateExpression();
    }
}

// Scientific functions
function scientificFunction(func) {
    const value = parseFloat(currentInput);
    let result;
    
    try {
        switch (func) {
            case 'sin':
                result = Math.sin(isRadians ? value : value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(isRadians ? value : value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(isRadians ? value : value * Math.PI / 180);
                break;
            case 'asin':
                result = Math.asin(value);
                if (!isRadians) result = result * 180 / Math.PI;
                break;
            case 'acos':
                result = Math.acos(value);
                if (!isRadians) result = result * 180 / Math.PI;
                break;
            case 'atan':
                result = Math.atan(value);
                if (!isRadians) result = result * 180 / Math.PI;
                break;
            case 'log':
                if (value <= 0) {
                    showError('Invalid input for log');
                    return;
                }
                result = Math.log10(value);
                break;
            case 'ln':
                if (value <= 0) {
                    showError('Invalid input for ln');
                    return;
                }
                result = Math.log(value);
                break;
            case 'sqrt':
                if (value < 0) {
                    showError('Invalid input for sqrt');
                    return;
                }
                result = Math.sqrt(value);
                break;
            case 'pow':
                result = Math.pow(value, 2);
                break;
            case 'exp':
                result = Math.exp(value);
                break;
            case 'pow10':
                result = Math.pow(10, value);
                break;
            case 'pi':
                result = Math.PI;
                break;
            case 'factorial':
                if (value < 0 || value !== Math.floor(value) || value > 170) {
                    showError('Invalid input for factorial');
                    return;
                }
                result = factorial(value);
                break;
            case 'abs':
                result = Math.abs(value);
                break;
            case 'floor':
                result = Math.floor(value);
                break;
            case 'ceil':
                result = Math.ceil(value);
                break;
            case 'random':
                result = Math.random();
                break;
            case 'mod':
                if (previousInput !== null) {
                    result = previousInput % value;
                    previousInput = null;
                    operator = null;
                } else {
                    showError('No previous value for mod');
                    return;
                }
                break;
        }
        
        currentExpression = func + '(' + value + ') =';
        currentInput = formatResult(result);
        isNewInput = true;
        updateDisplay();
        updateExpression();
        
    } catch (error) {
        showError('Math Error');
    }
}

// Factorial function
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Format result for display
function formatResult(result) {
    if (isNaN(result) || !isFinite(result)) {
        return 'Error';
    }
    
    // Handle very large or very small numbers
    if (Math.abs(result) >= 1e15 || (Math.abs(result) < 1e-10 && result !== 0)) {
        return result.toExponential(10);
    }
    
    // Round to avoid floating point precision issues
    const rounded = Math.round(result * 1e12) / 1e12;
    
    // Format as integer if it's a whole number
    if (rounded === Math.floor(rounded)) {
        return rounded.toString();
    }
    
    // Format with appropriate decimal places
    return rounded.toString();
}

// Clear all
function clearAll() {
    currentInput = '0';
    currentExpression = '';
    operator = null;
    previousInput = null;
    isNewInput = true;
    updateDisplay();
    updateExpression();
}

// Clear entry
function clearEntry() {
    currentInput = '0';
    isNewInput = true;
    updateDisplay();
}

// Backspace
function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
        isNewInput = true;
    }
    updateDisplay();
}

// Memory functions
function memoryStore() {
    memory = parseFloat(currentInput);
    showMessage('Stored: ' + memory);
}

function memoryRecall() {
    currentInput = memory.toString();
    isNewInput = true;
    updateDisplay();
}

function memoryClear() {
    memory = 0;
    showMessage('Memory cleared');
}

function memoryAdd() {
    memory += parseFloat(currentInput);
    showMessage('Added: ' + currentInput);
}

function memorySubtract() {
    memory -= parseFloat(currentInput);
    showMessage('Subtracted: ' + currentInput);
}

// Show error message
function showError(message) {
    currentInput = 'Error';
    currentExpression = message;
    isNewInput = true;
    updateDisplay();
    updateExpression();
    
    // Clear error after 2 seconds
    setTimeout(() => {
        if (currentInput === 'Error') {
            clearAll();
        }
    }, 2000);
}

// Show message
function showMessage(message) {
    const originalExpression = currentExpression;
    currentExpression = message;
    updateExpression();
    
    setTimeout(() => {
        currentExpression = originalExpression;
        updateExpression();
    }, 1500);
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers and decimal point
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    }
    // Operators
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    }
    // Enter or equals
    else if (key === 'Enter' || key === '=') {
        calculate();
    }
    // Escape or clear
    else if (key === 'Escape') {
        clearAll();
    }
    // Backspace
    else if (key === 'Backspace') {
        backspace();
    }
    // Scientific functions (keyboard shortcuts)
    else if (key === 's' || key === 'S') {
        scientificFunction('sin');
    }
    else if (key === 'c' || key === 'C') {
        if (event.ctrlKey) {
            clearAll();
        } else {
            scientificFunction('cos');
        }
    }
    else if (key === 't' || key === 'T') {
        scientificFunction('tan');
    }
    else if (key === 'l' || key === 'L') {
        scientificFunction('log');
    }
    else if (key === 'n' || key === 'N') {
        scientificFunction('ln');
    }
    else if (key === 'r' || key === 'R') {
        scientificFunction('sqrt');
    }
    else if (key === 'p' || key === 'P') {
        scientificFunction('pi');
    }
});

// Initialize falling numbers with random digits
function initFallingNumbers() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        // Generate random number 0-9
        const randomNumber = Math.floor(Math.random() * 10);
        star.textContent = randomNumber;
        
        // Change number periodically for more dynamic effect
        setInterval(() => {
            const newNumber = Math.floor(Math.random() * 10);
            star.textContent = newNumber;
        }, Math.random() * 3000 + 1000); // Random interval between 1-4 seconds
    });
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', function() {
    init();
    initFallingNumbers();
});
