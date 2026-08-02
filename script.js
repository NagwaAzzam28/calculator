const operations = {
  "+": (n1, n2) => n1 + n2,
  "-": (n1, n2) => n1 - n2,
  "*": (n1, n2) => n1 * n2,
  "/": (n1, n2) => n1 / n2,
};

function operate(op, num1, num2) {
  return operations[op] ? operations[op](num1, num2) : "invalid";
}

console.log(operate("*", 10, 5));
