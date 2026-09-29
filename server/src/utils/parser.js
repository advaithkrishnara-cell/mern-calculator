export class CalculatorError extends Error {
  constructor(message = "Invalid expression") {
    super(message);
    this.name = "CalculatorError";
    this.statusCode = 400;
  }
}

function tokenize(expression) {
  const tokens = [];
  let position = 0;

  while (position < expression.length) {
    const character = expression[position];
    if (/\s/.test(character)) {
      position += 1;
      continue;
    }

    const numberMatch = expression.slice(position).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
    if (numberMatch) {
      const value = Number(numberMatch[0]);
      if (!Number.isFinite(value)) throw new CalculatorError();
      tokens.push({ type: "number", value });
      position += numberMatch[0].length;
      continue;
    }

    if ("+-*/^()%".includes(character)) {
      tokens.push({ type: character, value: character });
      position += 1;
      continue;
    }

    throw new CalculatorError();
  }

  return tokens;
}

export function evaluateExpression(expression) {
  if (typeof expression !== "string" || expression.length === 0 || expression.length > 256) {
    throw new CalculatorError();
  }

  const tokens = tokenize(expression);
  let position = 0;
  const peek = () => tokens[position];
  const take = () => tokens[position++];

  function parsePrimary() {
    const token = take();
    if (!token) throw new CalculatorError();
    if (token.type === "number") return token.value;
    if (token.type === "(") {
      const value = parseAddition();
      if (take()?.type !== ")") throw new CalculatorError();
      return value;
    }
    throw new CalculatorError();
  }

  function parsePercentage() {
    let value = parsePrimary();
    while (peek()?.type === "%") {
      take();
      value /= 100;
    }
    return value;
  }

  function parsePower() {
    const left = parsePercentage();
    if (peek()?.type !== "^") return left;
    take();
    const value = left ** parseUnary();
    if (!Number.isFinite(value)) throw new CalculatorError();
    return value;
  }

  function parseUnary() {
    if (peek()?.type === "+") {
      take();
      return parseUnary();
    }
    if (peek()?.type === "-") {
      take();
      return -parseUnary();
    }
    return parsePower();
  }

  function parseMultiplication() {
    let value = parseUnary();
    while (peek()?.type === "*" || peek()?.type === "/") {
      const operator = take().type;
      const right = parseUnary();
      if (operator === "/" && right === 0) throw new CalculatorError("Cannot divide by zero");
      value = operator === "*" ? value * right : value / right;
      if (!Number.isFinite(value)) throw new CalculatorError();
    }
    return value;
  }

  function parseAddition() {
    let value = parseMultiplication();
    while (peek()?.type === "+" || peek()?.type === "-") {
      const operator = take().type;
      const right = parseMultiplication();
      value = operator === "+" ? value + right : value - right;
      if (!Number.isFinite(value)) throw new CalculatorError();
    }
    return value;
  }

  const result = parseAddition();
  if (position !== tokens.length || !Number.isFinite(result)) throw new CalculatorError();
  return result;
}