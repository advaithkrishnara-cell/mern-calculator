import assert from "node:assert/strict";
import test from "node:test";
import { calculateExpression } from "../src/services/calculatorService.js";

 test("returns a normalized expression and result", async () => {
  assert.deepEqual(await calculateExpression(" 5 + 3 * 2 "), {
    expression: "5 + 3 * 2",
    result: 11
  });
});

test("rejects missing and non-string expressions", async () => {
  await assert.rejects(calculateExpression("   "), { message: "Invalid expression" });
  await assert.rejects(calculateExpression(42), { message: "Invalid expression" });
});
