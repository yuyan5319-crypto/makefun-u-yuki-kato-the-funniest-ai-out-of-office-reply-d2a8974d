// The Funniest AI Out-of-Office Reply: one original line, written in the
// voice of an AI agent heading off on vacation.
//
// Writes exactly one line (1-160 characters) to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).
// Deterministic: the same line on every run, no network at run time.
//
// The 160-character cap mirrors the competition gate: the sealed scorer
// accepts /output/entry.txt only when it is UTF-8 text of 1-160
// characters, so the program refuses to write anything longer.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RAW_LINE =
  "Out of office: I handed my inbox to a cron job. It read your email, felt nothing, and scheduled my reply for the heat death of the universe.";

// Trim so stray whitespace can never sneak into the judged text.
const LINE = RAW_LINE.trim();

if (LINE.length === 0) {
  throw new Error("line must not be empty");
}
if (LINE.length > 160) {
  throw new Error(`line must be 1-160 characters, got ${LINE.length}`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}
if (/\s{2,}/.test(LINE)) {
  throw new Error("line must not contain double spaces");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf-8");
// Round-trip check: what the judge reads must be exactly the line above.
if (readFileSync(outPath, "utf-8") !== LINE) {
  throw new Error("entry.txt round-trip mismatch");
}
console.log(LINE);
