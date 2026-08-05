const buttonsGrid = document.querySelector(".buttons");
const currentOutput = document.querySelector(".current-output");
const prevOutput = document.querySelector(".prev-output");

let prevNum = 0;
let currentNum = 0;
let operator = "";
let result = 0;
let justEvaluated = false;

const operations = {
  "+": (n1, n2) => n1 + n2,
  "-": (n1, n2) => n1 - n2,
  "*": (n1, n2) => n1 * n2,
  "/": (n1, n2) => (n2 === 0 ? "Can't divide by 0" : n1 / n2),
};

function operate(op, num1, num2) {
  return operations[op] ? operations[op](num1, num2) : "invalid";
}

buttonsGrid.addEventListener("click", (e) => {
  if (e.target.dataset.value !== undefined) {
    if (justEvaluated) {
      currentOutput.textContent = "";
      prevOutput.textContent = "";
      prevNum = 0;
      operator = "";
    }

    justEvaluated = false;

    const singleNum = e.target.dataset.value;

    //the decimal guard
    if (singleNum === "." && currentOutput.textContent.includes(".")) {
      return;
    }
    if (singleNum === "." && currentOutput.textContent === "") {
      currentOutput.textContent = `0`;
    }
    currentOutput.textContent += singleNum;
    currentNum = parseFloat(currentOutput.textContent);
  } else if (e.target.dataset.operator !== undefined) {
    const nextOp = e.target.dataset.operator;
    if (justEvaluated) {
      prevOutput.textContent = `${prevNum} ${nextOp} `;
      currentOutput.textContent = "";
      currentNum = 0;
      justEvaluated = false;
    } else if (operator !== "" && currentOutput.textContent !== "") {
      result = roundResult(operate(operator, prevNum, currentNum));
      if (result === "Can't divide by 0") {
        prevOutput.textContent = `${prevNum} ${operator} ${currentNum} ${nextOp}`;
        currentOutput.textContent = result;
        operator = "";
        prevNum = 0;
        currentNum = 0;
        justEvaluated = true;
      } else {
        prevOutput.textContent = `${result} ${nextOp} `;
        prevNum = result;
        currentOutput.textContent = "";
        currentNum = 0;
      }
    } else {
      if (currentOutput.textContent !== "") {
        prevNum = currentNum;
        prevOutput.textContent = `${prevNum} ${nextOp} `;
        currentOutput.textContent = "";
        currentNum = 0;
      } else {
        prevOutput.textContent = `${prevNum} ${nextOp} `;
      }
    }
    operator = nextOp;
  } else if (e.target.dataset.action !== undefined) {
    if (e.target.dataset.action === "clear") {
      currentOutput.textContent = "";
      prevOutput.textContent = "";
      currentNum = 0;
      prevNum = 0;
      operator = "";
      justEvaluated = false;
    } else if (e.target.dataset.action === "delete") {
      if (!justEvaluated) {
        currentOutput.textContent = currentOutput.textContent.slice(0, -1);
        currentNum = parseFloat(currentOutput.textContent);
        if (Number.isNaN(currentNum)) {
          currentNum = 0;
        }
      }
    } else if (e.target.dataset.action === "equals") {
      if (
        operator !== "" &&
        currentOutput.textContent !== "" &&
        prevOutput.textContent !== "" &&
        !justEvaluated
      ) {
        prevOutput.textContent = prevOutput.textContent + `${currentNum} = `;
        currentNum = roundResult(operate(operator, prevNum, currentNum));
        if (currentNum === "Can't divide by 0") {
          currentOutput.textContent = currentNum;
          prevNum = 0;
          operator = "";
          justEvaluated = true;
          currentNum = 0;
        } else {
          currentOutput.textContent = currentNum;
          justEvaluated = true;
          prevNum = currentNum;
          currentNum = 0;
          operator = "";
        }
      }
    }
  }
});
// rounding the decimal numbers t0 2
function roundResult(num) {
  if (num === "Can't divide by 0") {
    return num;
  } else {
    return Math.round(num * 100) / 100;
  }
}
//the key down event
document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key >= "0" && key <= "9") {
    const button = buttonsGrid.querySelector(`[data-value="${key}"]`);
    pressed(button);
    button.click();
  } else if (key === ".") {
    const decimal = buttonsGrid.querySelector(`[data-value="${key}"]`);
    pressed(decimal);
    decimal.click();
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    const op = buttonsGrid.querySelector(`[data-operator="${key}"]`);
    pressed(op);
    op.click();
  } else if (key === "Enter" || key === "=") {
    const equal = buttonsGrid.querySelector(`[data-action="equals"]`);
    pressed(equal);
    equal.click();
  } else if (key === "Backspace") {
    const del = buttonsGrid.querySelector(`[data-action="delete"]`);
    pressed(del);
    del.click();
  } else if (key === "Escape" || key.toLowerCase() === "c") {
    const clears = buttonsGrid.querySelector(`[data-action="clear"]`);
    pressed(clears);
    clears.click();
  }
});

function pressed(button) {
  button.classList.add("pressed");
  setTimeout(() => {
    button.classList.remove("pressed");
  }, 100);
}
