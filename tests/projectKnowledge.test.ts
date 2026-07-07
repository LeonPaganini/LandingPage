import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  learnedPatterns,
  mainPageSections,
  projectFileMap,
  projectHistory,
  recurringFunctions,
} from "../src/data/projectKnowledge.js";

const repoRoot = resolve(process.cwd());

test("project knowledge collections stay populated", () => {
  assert.ok(projectHistory.length >= 1);
  assert.ok(projectFileMap.length >= 1);
  assert.ok(recurringFunctions.length >= 1);
  assert.ok(learnedPatterns.length >= 1);
  assert.ok(mainPageSections.length >= 1);
});

test("project file map points to existing files", () => {
  const missingFiles = projectFileMap
    .map((entry) => entry.path)
    .filter((path) => !existsSync(resolve(repoRoot, path)));

  assert.deepEqual(missingFiles, []);
});
