import test from "node:test";
import assert from "node:assert/strict";
import { calculateBodyFat } from "../src/Calculator.js";

test("bf calculation for woman sample stays near expected", () => {
  const result = calculateBodyFat("female", {
    height: 155,
    waist: 82,
    hip: 97,
    neck: 34,
  });

  assert.ok(result !== null, "result should not be null");
  assert.ok(result! >= 32 && result! <= 36, `unexpected body fat value: ${result}`);
});
