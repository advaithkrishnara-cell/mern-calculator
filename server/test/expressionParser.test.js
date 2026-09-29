import assert from "node:assert/strict";
import test from "node:test";
import { CalculatorError, evaluateExpression } from "../src/utils/parser.js";

const cases = [
  ["5 + 3", 8],
  ["10 - 4", 6],
  ["6 * 7", 42],
  ["20 / 5", 4],
  ["2 ^ 3", 8],
  ["20%", 0.2],
  ["5 + 3 * 2", 11],
  ["(5 + 3) * 2", 16],
  ["-5 + 3", -2],
  ["5 * -2", -10],
  ["2 ^ 3 ^ 2", 512],
  [".5 + 1.25", 1.75]
];

for (const [expression, expected] of cases) {
  test(`${expression} evaluates to ${expected}`, () => {
    assert.equal(evaluateExpression(expression), expected);
  });
}

test("rejects division by zero", () => {
  assert.throws(() => evaluateExpression("10 / 0"), (error) => {
    assert.ok(error instanceof CalculatorError);
    assert.equal(error.message, "Cannot divide by zero");
    return true;
  });
});

test("rejects malformed, incomplete, and unsupported expressions", () => {
  for (const expression of ["", "5 + * 3", "3.1.4", "(5 + 3", "5 + 3)", "2 ** 3", "1 + process.exit()", "2(3)"]) {
    assert.throws(() => evaluateExpression(expression), CalculatorError, expression);
  }
});

test("rejects overly long expressions and non-finite results", () => {
  assert.throws(() => evaluateExpression("1".repeat(257)), CalculatorError);
  assert.throws(() => evaluateExpression("9 ^ 999"), CalculatorError);
});
